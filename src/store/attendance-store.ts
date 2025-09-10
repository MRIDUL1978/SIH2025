import { create } from 'zustand';
import { courses, Student, allStudents } from '@/lib/mock-data';

export type AttendanceStatus = 'Present' | 'Absent';

export type AttendanceRecord = {
  studentId: string;
  status: AttendanceStatus;
  timestamp?: Date;
};

type AttendanceState = {
  attendance: Record<string, AttendanceRecord[]>; // courseId -> records
  getAttendanceForCourse: (courseId: string) => { student: Student; record?: AttendanceRecord }[];
  checkIn: (courseId: string, studentId: string) => void;
  getStudentAttendanceStats: (studentId: string) => { attended: number; total: number; percentage: number };
  getOverallAttendanceStats: () => { courseId: string; courseName: string; code: string; attendanceRate: number }[];
  getInstitutionWideStats: () => { totalStudents: number; averageAttendance: number };
};

const initialAttendance: Record<string, AttendanceRecord[]> = {};
courses.forEach(course => {
  initialAttendance[course.id] = course.students.map(student => ({
    studentId: student.id,
    status: 'Absent',
  }));
});

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendance: initialAttendance,

  getAttendanceForCourse: (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return [];
    
    const courseAttendance = get().attendance[courseId] || [];
    
    return course.students.map(student => {
      const record = courseAttendance.find(r => r.studentId === student.id);
      return { student, record };
    });
  },

  checkIn: (courseId: string, studentId: string) => {
    set(state => {
      const courseAttendance = state.attendance[courseId];
      if (!courseAttendance) return state;

      const studentExistsInCourse = courses.find(c => c.id === courseId)?.students.some(s => s.id === studentId);
      if(!studentExistsInCourse) return state;

      const studentIndex = courseAttendance.findIndex(r => r.studentId === studentId);

      if (studentIndex > -1) {
        const updatedAttendance = [...courseAttendance];
        updatedAttendance[studentIndex] = { ...updatedAttendance[studentIndex], status: 'Present', timestamp: new Date() };
        return {
          attendance: {
            ...state.attendance,
            [courseId]: updatedAttendance,
          },
        };
      }
      return state;
    });
  },

  getStudentAttendanceStats: (studentId: string) => {
    const { attendance } = get();
    let attended = 0;
    let total = 0;

    courses.forEach(course => {
        if(course.students.some(s => s.id === studentId)) {
            total++;
            const record = (attendance[course.id] || []).find(r => r.studentId === studentId);
            if (record?.status === 'Present') {
                attended++;
            }
        }
    });
    
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
    return { attended, total, percentage };
  },

  getOverallAttendanceStats: () => {
    const { attendance } = get();
    return courses.map(course => {
      const records = attendance[course.id] || [];
      const total = records.length;
      const present = records.filter(r => r.status === 'Present').length;
      const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
      return {
        courseId: course.id,
        courseName: course.name,
        code: course.code,
        attendanceRate: attendanceRate,
      };
    });
  },

  getInstitutionWideStats: () => {
    const overallStats = get().getOverallAttendanceStats();
    const totalStudents = allStudents.length;
    const totalRates = overallStats.reduce((sum, course) => sum + course.attendanceRate, 0);
    const averageAttendance = overallStats.length > 0 ? Math.round(totalRates / overallStats.length) : 0;
    return { totalStudents, averageAttendance };
  }
}));
