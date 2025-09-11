
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
import { useAttendanceStore } from '@/store/attendance-store';
import { Check, Loader2, QrCode, VideoOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useFacultyQrStore } from '@/store/faculty-qr-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Course } from '@/store/attendance-store';

export default function CheckInPage() {
  const { user } = useAuth();
  const [studentCourses, setStudentCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { checkIn } = useAttendanceStore();
  const { getQrDataForCourse } = useFacultyQrStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      // Fetch all courses, as all students are enrolled in all courses
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setStudentCourses(coursesData);
    };
    fetchCourses();
  }, [user]);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof window !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
    
    if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to check in.',
          variant: 'destructive',
        });
        return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    // Simulate scanning and API call
    setTimeout(() => {
      const studentId = user.uid; 
      const activeQrData = getQrDataForCourse(selectedCourse);

      if (!activeQrData) {
        setIsLoading(false);
        toast({
          title: 'Check-in Failed',
          description: `No active QR code was found for this course. Please ask your professor to generate one.`,
          variant: 'destructive',
        });
        return;
      }
      
      // In a real app, you would decode the QR from the video stream and validate its data.
      // Here, we just check if any active QR data exists for the course.
      checkIn(selectedCourse, studentId);
      
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
                  <Alert variant="destructive" className="bg-transparent border-0 text-white">
                      <VideoOff className="h-4 w-4" />
                      <AlertTitle>Camera not available</AlertTitle>
                      <AlertDescription className="text-gray-300">
                          Please grant camera permissions to continue.
                      </AlertDescription>
                  </Alert>
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
