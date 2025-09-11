
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AttendanceRecord } from '@/store/attendance-store';
import { format } from 'date-fns';

interface CourseAttendanceDetailsProps {
  records: AttendanceRecord[];
}

export function CourseAttendanceDetails({ records }: CourseAttendanceDetailsProps) {
  const sortedRecords = records.sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      return b.timestamp.getTime() - a.timestamp.getTime();
    }
    return 0;
  });

  return (
    <div className="p-4">
      <h4 className="text-lg font-semibold mb-2">Attendance History</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecords.length > 0 ? (
            sortedRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell>
                  {record.timestamp
                    ? format(new Date(record.timestamp), 'MMM dd, yyyy HH:mm')
                    : 'N/A'}
                </TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                No attendance records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
