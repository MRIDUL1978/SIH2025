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
import { Check, Loader2, QrCode } from 'lucide-react';
import { useState } from 'react';

export default function CheckInPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { checkIn } = useAttendanceStore();

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
      // In a real app, the QR code would contain the course ID.
      // Here we use the selected course and a mock student ID.
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
            Select your course and scan the QR code to mark your attendance.
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleScan} className="w-full" size="lg" disabled={isLoading || isSuccess}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isSuccess ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <QrCode className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Scanning...' : isSuccess ? 'Checked In!' : 'Simulate QR Scan'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
