import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { getDoc, doc, collection, getDocs, updateDoc } from 'firebase/firestore';

export type Student = {
  id: string; // This is the user's UID from Firebase Auth
  name: string;
  email: string;
  avatarUrl?: string; // Kept for UI, can be generated or stored in user profile
};

export type Course = {
  id: string; // Firestore document ID
  name: string;
  code: string;
  facultyId: string;
  facultyName: string;
  studentIds: string[];
};

export type AttendanceStatus = 'Present' | 'Absent';

export type AttendanceRecord = {
  studentId: string;
  status: AttendanceStatus;
  timestamp?: Date;
};

// A simple in-memory cache for courses to avoid re-fetching
const courseCache = new Map<string, Course>();
const studentCache = new Map<string, Student>();

const fetchCourse = async (courseId: string): Promise<Course | null> => {
    if (courseCache.has(courseId)) {
        return courseCache.get(courseId)!;
    }
    try {
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
            const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
            courseCache.set(courseId, courseData);
            return courseData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching course:", error);
        return null;
    }
}

const fetchStudent = async (studentId: string): Promise<Student | null> => {
    if (studentCache.has(studentId)) {
        return studentCache.get(studentId)!;
    }
    try {
        const studentRef = doc(db, 'users', studentId);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
            const studentData = { id: studentSnap.id, avatarUrl: `https://picsum.photos/seed/${studentSnap.id}/100/100`, ...studentSnap.data() } as Student;
            studentCache.set(studentId, studentData);
            return studentData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching student:", error);
        return null;
    }
}

const fetchAllCourses = async (): Promise<Course[]> => {
    // For simplicity, we fetch all courses for admin stats.
    // In a larger app, this would be paginated or summarized on the backend.
    try {
        const coursesRef = collection(db, 'courses');
        const querySnapshot = await getDocs(coursesRef);
        const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        courses.forEach(c => courseCache.set(c.id, c));
        return courses;
    } catch(error) {
        console.error("Error fetching all courses", error);
        return [];
    }
}

const fetchAllStudents = async (): Promise<Student[]> => {
    try {
        const studentsRef = collection(db, 'users');
        const querySnapshot = await getDocs(studentsRef);
        const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
        students.forEach(s => studentCache.set(s.id, s));
        return students;
    } catch(error) {
        console.error("Error fetching all students", error);
        return [];
    }
}


type AttendanceState = {
  attendance: Record<string, AttendanceRecord[]>; // courseId -> records
  getAttendanceForCourse: (courseId: string) => { student: Student; record?: AttendanceRecord }[];
  getAttendanceHistoryForStudent: (courseId: string, studentId: string) => AttendanceRecord[];
  getLatestAttendanceForStudent: (courseId: string, studentId: string) => AttendanceRecord | undefined;
  initializeRoster: (courseId: string) => Promise<void>;
  checkIn: (courseId: string, studentId: string) => void;
  getStudentAttendanceStats: (studentId: string) => { attended: number; total: number; percentage: number };
  getOverallAttendanceStats: () => Promise<{ courseId: string; courseName: string; code: string; attendanceRate: number }[]>;
  getInstitutionWideStats: () => Promise<{ totalStudents: number; averageAttendance: number }>;
};

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendance: {},

  initializeRoster: async (courseId: string) => {
    const course = await fetchCourse(courseId);
    if (!course) return;

    // Ensure all students for the course are cached
    await Promise.all(course.studentIds.map(studentId => fetchStudent(studentId)));

    // Initialize with an 'Absent' status only if no records exist for that student for today.
    // This part is complex with history. We will simplify: the absence is implicit.
    // The main job here is to ensure student data is loaded.
  },

  getAttendanceForCourse: (courseId:string) => {
    const course = courseCache.get(courseId);
    if (!course) return [];

    // This function will now return the latest status for each student on the roster.
    return course.studentIds.map(studentId => {
        const student = studentCache.get(studentId)!;
        const record = get().getLatestAttendanceForStudent(courseId, studentId);
        return { student, record };
    }).filter(item => item.student);
  },

  getAttendanceHistoryForStudent: (courseId: string, studentId: string) => {
    const courseRecords = get().attendance[courseId] || [];
    return courseRecords.filter(r => r.studentId === studentId);
  },

  getLatestAttendanceForStudent: (courseId: string, studentId: string) => {
    const history = get().getAttendanceHistoryForStudent(courseId, studentId);
    if (history.length === 0) return undefined;
    return history.sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))[0];
  },

  checkIn: (courseId: string, studentId: string) => {
    set(state => {
      const courseAttendance = state.attendance[courseId] || [];
      const newRecord: AttendanceRecord = { 
        studentId, 
        status: 'Present', 
        timestamp: new Date() 
      };
      
      const updatedAttendance = [...courseAttendance, newRecord];
      
      const course = courseCache.get(courseId);
      if (course && !course.studentIds.includes(studentId)) {
        const courseRef = doc(db, 'courses', courseId);
        const newStudentIds = [...course.studentIds, studentId];
        updateDoc(courseRef, { studentIds: newStudentIds });
        course.studentIds = newStudentIds;
        courseCache.set(courseId, course);
      }
      
      return {
        attendance: {
          ...state.attendance,
          [courseId]: updatedAttendance,
        },
      };
    });
  },

  getStudentAttendanceStats: (studentId: string) => {
    const { attendance } = get();
    let attended = 0;
    let total = 0;

    // This calculation should be based on number of sessions, which we don't explicitly track.
    // Let's calculate based on present records vs total records for the student.
    Object.values(attendance).flat().forEach(record => {
        if (record.studentId === studentId) {
            total++;
            if (record.status === 'Present') {
                attended++;
            }
        }
    });

    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
    return { attended, total, percentage };
  },

  getOverallAttendanceStats: async () => {
    const courses = await fetchAllCourses();
    const { attendance } = get();
    return courses.map(course => {
      const records = attendance[course.id] || [];
      const present = records.filter(r => r.status === 'Present').length;
      // Total should be based on sessions, but for a simple stat, we use total records.
      const total = records.length;
      const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
      return {
        courseId: course.id,
        courseName: course.name,
        code: course.code,
        attendanceRate: attendanceRate,
      };
    });
  },

  getInstitutionWideStats: async () => {
    const overallStats = await get().getOverallAttendanceStats();
    const students = await fetchAllStudents();
    const totalStudents = students.length;
    const totalRates = overallStats.reduce((sum, course) => sum + course.attendanceRate, 0);
    const averageAttendance = overallStats.length > 0 ? Math.round(totalRates / overallStats.length) : 0;
    return { totalStudents, averageAttendance };
  }
}));
