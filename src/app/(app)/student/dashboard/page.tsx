'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAttendanceStore } from '@/store/attendance-store';
import { CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import type { Course } from '@/store/attendance-store';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getStudentAttendanceStats } = useAttendanceStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Fetch courses where the student's UID is in the 'students' array
        const q = query(collection(db, 'courses'), where('studentIds', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        const studentCourses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(studentCourses);
      } catch (error) {
        console.error("Error fetching student courses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Using a mock student ID for demonstration - this will need to be updated
  const mockStudentId = 's1'; 
  const { attended, total, percentage } = getStudentAttendanceStats(mockStudentId);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Attendance
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {attended} of {total} classes attended
            </p>
            <Progress value={percentage} className="mt-4 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Courses Enrolled
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/4" />
            ) : (
              <div className="text-2xl font-bold">{courses.length}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Across all semesters
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Courses</CardTitle>
            <CardDescription>
              Your enrolled courses for the current semester.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Faculty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    </TableRow>
                  ))
                ) : courses.length > 0 ? (
                  courses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.facultyName}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">You are not enrolled in any courses.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
