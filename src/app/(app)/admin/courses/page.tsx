
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Course } from "@/store/attendance-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Faculty = {
  uid: string;
  name: string;
};

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  facultyId: z.string().min(1, "A faculty member must be assigned"),
});

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(courseSchema),
  });

  useEffect(() => {
    // Fetch faculty members
    const fetchFaculty = async () => {
      const q = query(collection(db, "users"), where("role", "==", "faculty"));
      const querySnapshot = await getDocs(q);
      const facultyList = querySnapshot.docs.map(doc => ({ uid: doc.id, name: doc.data().name }));
      setFaculty(facultyList);
    };

    fetchFaculty();

    // Listen for real-time updates on courses
    const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setCourses(coursesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching courses:", error);
      toast({ title: "Error", description: "Could not fetch courses.", variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    try {
      const assignedFaculty = faculty.find(f => f.uid === data.facultyId);
      if (!assignedFaculty) {
        throw new Error("Invalid faculty selected");
      }
      
      await addDoc(collection(db, "courses"), {
        name: data.name,
        code: data.code,
        facultyId: data.facultyId,
        facultyName: assignedFaculty.name,
        studentIds: [], // Initially no students enrolled
      });
      
      toast({ title: "Success", description: "Course created successfully." });
      reset();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating course:", error);
      toast({ title: "Error", description: `Failed to create course: ${error.message}`, variant: "destructive" });
    }
  };
  
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteDoc(doc(db, "courses", courseId));
      toast({ title: "Success", description: "Course deleted successfully." });
    } catch (error: any) {
      console.error("Error deleting course:", error);
      toast({ title: "Error", description: `Failed to delete course: ${error.message}`, variant: "destructive" });
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex items-center">
        <h1 className="text-3xl font-headline font-bold">Manage Courses</h1>
        <div className="ml-auto flex items-center gap-2">
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Course
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new course.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Course Name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input id="code" {...register("code")} />
                     {errors.code && <p className="text-sm text-destructive">{errors.code.message as string}</p>}
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="facultyId">Assign Faculty</Label>
                     <Controller
                        name="facultyId"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a faculty member..." />
                                </SelectTrigger>
                                <SelectContent>
                                {faculty.map(f => (
                                    <SelectItem key={f.uid} value={f.uid}>{f.name}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        )}
                        />
                    {errors.facultyId && <p className="text-sm text-destructive">{errors.facultyId.message as string}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create Course</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Course List</CardTitle>
          <CardDescription>
            A list of all courses in the institution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Assigned Faculty</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : courses.length > 0 ? (
                courses.map(course => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.facultyName}</TableCell>
                    <TableCell>
                      <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                               <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Delete
                                </DropdownMenuItem>
                               </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the course and all associated attendance data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">No courses found. Add one to get started.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
