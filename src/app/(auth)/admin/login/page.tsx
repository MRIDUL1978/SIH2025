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
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin/dashboard");
  };

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleLogin}>
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the analytics dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@school.edu" required defaultValue="admin@school.edu"/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required defaultValue="password"/>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">Sign in</Button>
          <p className="text-xs text-center text-muted-foreground">
            Not an admin? Log in as{" "}
            <Link href="/student/login" className="underline hover:text-primary">
              Student
            </Link> or{" "}
            <Link href="/faculty/login" className="underline hover:text-primary">
              Faculty
            </Link>.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
