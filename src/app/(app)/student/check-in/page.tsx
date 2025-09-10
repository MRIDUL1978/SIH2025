'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { studentCourses } from '@/lib/mock-data';
import { useAttendanceStore } from '@/store/attendance-store';
import { Check, Loader2, QrCode, VideoOff, Camera } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function CheckInPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { checkIn } = useAttendanceStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof window !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      } else {
        setHasCameraPermission(false);
        toast({
            variant: 'destructive',
            title: 'Camera Not Supported',
            description: 'Your browser does not support camera access.',
          });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleScan = () => {
    if (!selectedCourse) {
      toast({
        title: 'Error',
        description: 'Please select a course first.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setIsSuccess(false);

    // Simulate scanning and API call
    setTimeout(() => {
      const mockStudentId = 's1'; 
      checkIn(selectedCourse, mockStudentId);
      
      setIsLoading(false);
      setIsSuccess(true);
      toast({
        title: 'Check-in Successful!',
        description: `You've been marked present for ${studentCourses.find(c => c.id === selectedCourse)?.name}.`,
      });

      // Reset after a few seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Attendance Check-In</CardTitle>
          <CardDescription>
            Select your course, point your camera at the QR code, and scan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedCourse} value={selectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select a course..." />
            </SelectTrigger>
            <SelectContent>
              {studentCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center">
                    <VideoOff className="mb-2 h-10 w-10 text-white" />
                    <p className="font-semibold text-white">Camera not available</p>
                    <p className="text-sm text-muted-foreground text-gray-300">
                        Please grant camera permissions in your browser settings.
                    </p>
                </div>
            )}
             {hasCameraPermission === null && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )}
          </div>

        </CardContent>
        <CardFooter>
          <Button onClick={handleScan} className="w-full" size="lg" disabled={isLoading || isSuccess || !hasCameraPermission}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isSuccess ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <QrCode className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Checking In...' : isSuccess ? 'Checked In!' : 'Simulate QR Scan'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
