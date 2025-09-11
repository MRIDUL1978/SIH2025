
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
import { CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/config';
import { getDocs, collection } from 'firebase/firestore';
import type { Course, AttendanceRecord } from '@/store/attendance-store';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CourseAttendanceDetails } from '@/components/course-attendance-details';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getStudentAttendanceStats, getLatestAttendanceForStudent, getAttendanceHistoryForStudent, initializeRoster } = useAttendanceStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCourseId, setOpenCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };

    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const studentCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(studentCourses);
        
        for (const course of studentCourses) {
          await initializeRoster(course.id);
        }

      } catch (error) {
        console.error("Error fetching student courses: ", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user, initializeRoster]);

  const { attended, total, percentage } = user 
    ? getStudentAttendanceStats(user.uid)
    : { attended: 0, total: 0, percentage: 0 };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Attendance
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground dark:text-muted-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {attended} of {total} sessions attended
            </p>
            <Progress value={percentage} className="mt-4 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Courses Enrolled
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground dark:text-muted-foreground/80" />
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
              Your enrolled courses and their attendance status. Click a course to see your attendance history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Last Status</TableHead>
                  <TableHead>Last Check-in</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : courses.length > 0 ? (
                  courses.map(course => {
                    const latestRecord = user ? getLatestAttendanceForStudent(course.id, user.uid) : undefined;
                    const history = user ? getAttendanceHistoryForStudent(course.id, user.uid) : [];
                    const isOpen = openCourseId === course.id;

                    return (
                      <Collapsible asChild key={course.id} onOpenChange={() => setOpenCourseId(isOpen ? null : course.id)}>
                        <>
                          <TableRow className="cursor-pointer">
                            <TableCell className="font-medium">{course.code}</TableCell>
                            <TableCell>{course.name}</TableCell>
                            <TableCell>{course.facultyName}</TableCell>
                            <TableCell>{latestRecord?.status || 'Absent'}</TableCell>
                            <TableCell>
                              {latestRecord?.timestamp 
                                ? format(new Date(latestRecord.timestamp), 'MMM dd, yyyy HH:mm') 
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  <span className="sr-only">Toggle details</span>
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                          </TableRow>
                          <CollapsibleContent asChild>
                            <tr>
                              <td colSpan={6}>
                                <CourseAttendanceDetails records={history} />
                              </td>
                            </tr>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">You are not enrolled in any courses.</TableCell>
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
