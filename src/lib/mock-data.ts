export type Student = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  faculty: string;
  students: Student[];
};

export const students: Student[] = [
  { id: 's1', name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/seed/1/100/100' },
  { id: 's2', name: 'Bob Williams', avatarUrl: 'https://picsum.photos/seed/2/100/100' },
  { id: 's3', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/3/100/100' },
  { id: 's4', name: 'Diana Miller', avatarUrl: 'https://picsum.photos/seed/4/100/100' },
  { id: 's5', name: 'Ethan Davis', avatarUrl: 'https://picsum.photos/seed/5/100/100' },
  { id: 's6', name: 'Fiona Garcia', avatarUrl: 'https://picsum.photos/seed/6/100/100' },
];

export const courses: Course[] = [
  { 
    id: 'cs101', 
    name: 'Intro to Computer Science', 
    code: 'CS 101', 
    faculty: 'Dr. Alan Turing',
    students: students.slice(0, 4)
  },
  { 
    id: 'ma202', 
    name: 'Advanced Calculus', 
    code: 'MA 202',
    faculty: 'Dr. Ada Lovelace',
    students: students.slice(2, 6)
  },
  {
    id: 'ph305',
    name: 'Quantum Mechanics',
    code: 'PH 305',
    faculty: 'Dr. Marie Curie',
    students: students.slice(0, 2).concat(students.slice(4, 6))
  }
];

export const allStudents = students;

export const facultyCourses = [courses[0], courses[2]];
export const studentCourses = [courses[0], courses[1]];
