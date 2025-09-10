"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { QrCodeDisplay } from "@/components/qr-code-display";
import { generateSecureQrCode } from "@/ai/flows/secure-qr-code-generation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, RefreshCw } from "lucide-react";
import { courses } from "@/lib/mock-data";
import { useParams } from "next/navigation";

const SECRET_KEY = "your-super-secret-key-for-hashing";
const REFRESH_INTERVAL = 60; // seconds

export default function QrCodeGeneratorPage() {
  const [qrData, setQrData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  const params = useParams();
  const courseId = params.id as string;
  const course = courses.find(c => c.id === courseId);
  const pageTitle = course ? `QR for ${course.name}` : "Generate QR Code";

  const generateCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const input = {
        courseId: courseId,
        timestamp: Date.now(),
        secretKey: SECRET_KEY,
      };
      const result = await generateSecureQrCode(input);
      setQrData(result.qrCodeData);
      setCountdown(REFRESH_INTERVAL);
    } catch (e) {
      console.error(e);
      setError("Failed to generate QR code. Please try again.");
      setQrData(null);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    generateCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]); // Only run when courseId changes

  useEffect(() => {
    if (!isLoading && qrData) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            generateCode();
            return REFRESH_INTERVAL;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLoading, qrData, generateCode]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">{pageTitle}</h2>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-sm space-y-4">
          {isLoading && !error && <Skeleton className="h-[420px] w-full" />}
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {qrData && !isLoading && (
            <>
              <QrCodeDisplay qrData={qrData} />
              <div className="text-center font-mono text-lg text-muted-foreground">
                Refreshes in: {countdown}s
              </div>
            </>
          )}
          <Button onClick={generateCode} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Generating..." : "Regenerate Now"}
          </Button>
        </div>
      </div>
    </main>
  );
}
