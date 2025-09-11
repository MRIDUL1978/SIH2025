'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { useAttendanceStore, Course } from '@/store/attendance-store';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function AttendancePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const { getAttendanceForCourse } = useAttendanceStore();
  
  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      setLoading(true);
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
      } else {
        console.error("Course not found");
      }
      setLoading(false);
    };
    fetchCourse();
  }, [courseId]);
  
  const attendanceData = useMemo(() => getAttendanceForCourse(courseId), [getAttendanceForCourse, courseId]);

  const presentCount = attendanceData.filter(
    ({ record }) => record?.status === 'Present'
  ).length;
  const totalStudents = attendanceData.length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  if (loading) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-96" />
        </main>
    )
  }

  if (!course) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <h2 className="text-2xl font-bold">Course not found.</h2>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">{course.name}</CardTitle>
            <CardDescription>{course.code}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">{presentCount} of {totalStudents} students present</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Student Roster</CardTitle>
          <CardDescription>
            Live attendance status for {course.name}. Updates in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check-in Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map(({ student, record }) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{student.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={record?.status === 'Present' ? 'default' : 'secondary'} className={record?.status === 'Present' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}>
                      {record?.status || 'Absent'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record?.status === 'Present' && record.timestamp
                      ? record.timestamp.toLocaleTimeString()
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
