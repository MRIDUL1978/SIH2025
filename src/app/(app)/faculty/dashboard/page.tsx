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
import { facultyCourses } from '@/lib/mock-data';
import { QrCode, Users } from 'lucide-react';
import Link from 'next/link';

export default function FacultyDashboard() {
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
              {facultyCourses.map(course => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell className="text-center">
                    {course.students.length}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
