"use client";

import QRCode from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type QrCodeDisplayProps = {
  qrData: string;
};

export function QrCodeDisplay({ qrData }: QrCodeDisplayProps) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="items-center">
        <CardTitle className="text-center font-headline">Live QR Code</CardTitle>
        <CardDescription>This code is time-sensitive.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <QRCode value={qrData} size={256} level="H" includeMargin={true} />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Students can scan this code with the AttendEase app to check-in.
        </p>
      </CardContent>
    </Card>
  );
}
