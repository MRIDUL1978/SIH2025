"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { QrCodeDisplay } from "@/components/qr-code-display";
import { generateSecureQrCode } from "@/ai/flows/secure-qr-code-generation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useFacultyQrStore } from "@/store/faculty-qr-store";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import type { Course } from "@/store/attendance-store";

const SECRET_KEY = "your-super-secret-key-for-hashing";
const REFRESH_INTERVAL = 60; // seconds

export default function QrCodeGeneratorPage() {
  const { setQrDataForCourse, getQrDataForCourse } = useFacultyQrStore();
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [qrData, setQrData] = useState<string | null>(getQrDataForCourse(courseId));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  
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
      setQrDataForCourse(courseId, result.qrCodeData);
      setCountdown(REFRESH_INTERVAL);
    } catch (e) {
      console.error(e);
      setError("Failed to generate QR code. Please try again.");
      setQrData(null);
      setQrDataForCourse(courseId, null);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, setQrDataForCourse]);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
        try {
            const courseRef = doc(db, 'courses', courseId);
            const courseSnap = await getDoc(courseRef);
            if (courseSnap.exists()) {
                setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
            } else {
                setError("Course not found.");
            }
        } catch (err) {
            setError("Failed to fetch course details.");
            console.error(err);
        }
    };
    
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    // only generate code once we have a course
    if(course) {
        generateCode();
    }
  }, [generateCode, course]);

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
          <Button onClick={generateCode} disabled={isLoading || !course} className="w-full">
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
