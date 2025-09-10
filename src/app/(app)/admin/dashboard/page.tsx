'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from 'recharts';
import { useAttendanceStore } from '@/store/attendance-store';
import { TrendingUp, Users } from 'lucide-react';

const COLORS = ['#6666FF', '#40E0D0', '#FFC107', '#FF6B6B', '#9C27B0'];

export default function AdminDashboard() {
  const { getOverallAttendanceStats, getInstitutionWideStats } = useAttendanceStore();
  const overallStats = getOverallAttendanceStats();
  const { totalStudents, averageAttendance } = getInstitutionWideStats();
  
  const pieChartData = [
    { name: 'Average Attendance', value: averageAttendance },
    { name: 'Average Absence', value: 100 - averageAttendance },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="text-3xl font-headline font-bold">Admin Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Institution-Wide Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              Average across all courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Total enrolled students
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Attendance Rate by Course</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={overallStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="code"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Bar dataKey="attendanceRate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Overall Attendance Distribution</CardTitle>
            <CardDescription>
              Average attendance vs. absence across the institution.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                        }}
                    />
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                        <Cell key={`cell-0`} fill={COLORS[0]} />
                        <Cell key={`cell-1`} fill={COLORS[3]} opacity={0.5} />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
