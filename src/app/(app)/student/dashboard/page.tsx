'use client';

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
import { studentCourses } from '@/lib/mock-data';
import { useAttendanceStore } from '@/store/attendance-store';
import { CheckCircle, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const { getStudentAttendanceStats } = useAttendanceStore();
  // Using a mock student ID for demonstration
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
            <div className="text-2xl font-bold">{studentCourses.length}</div>
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
                {studentCourses.map(course => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.faculty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
