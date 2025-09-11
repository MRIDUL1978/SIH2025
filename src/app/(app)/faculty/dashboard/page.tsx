
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { QrCode, Users, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Course } from '@/store/attendance-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const q = query(collection(db, 'courses'), where('facultyId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const facultyCourses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(facultyCourses);
      } catch (err: any) {
        console.error("Error fetching faculty courses: ", err);
        setError("Could not fetch your courses. This might be a permissions issue. The required Firestore index may be missing.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="text-3xl font-headline font-bold">Faculty Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Courses</CardTitle>
          <CardDescription>
            Manage attendance for your assigned courses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
             <Alert variant="destructive" className="mb-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead className="text-center">Enrolled Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-9 w-48 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : courses.length > 0 ? (
                courses.map(course => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell className="text-center">
                      {course.studentIds.length}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/faculty/course/${course.id}/attendance`}>
                            <Users className="mr-2 h-4 w-4" />
                            View Roster
                          </Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href={`/faculty/course/${course.id}/qr`}>
                            <QrCode className="mr-2 h-4 w-4" />
                            Generate QR
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">You are not assigned to any courses.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
