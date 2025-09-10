"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FacultyLoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/faculty/dashboard");
  };

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleLogin}>
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
             <div className="p-3 bg-primary/10 rounded-full">
              <UserCog className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline">Faculty Login</CardTitle>
          <CardDescription>
            Enter your credentials to manage your courses.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="faculty@school.edu" required defaultValue="faculty@school.edu" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required defaultValue="password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">Sign in</Button>
           <p className="text-xs text-center text-muted-foreground">
            Not a faculty member? Log in as{" "}
            <Link href="/student/login" className="underline hover:text-primary">
              Student
            </Link> or{" "}
            <Link href="/admin/login" className="underline hover:text-primary">
              Admin
            </Link>.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
