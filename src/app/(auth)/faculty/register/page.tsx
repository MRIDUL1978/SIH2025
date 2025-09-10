
"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Loader2, UserCog } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FacultyRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({
        title: "Name is required",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      await register(auth, email, password, name, 'faculty');
      toast({ title: "Registration Successful" });
      router.push("/faculty/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleRegister}>
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserCog className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline">Faculty Registration</CardTitle>
          <CardDescription>
            Create a faculty account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="Dr. Alan Turing" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="faculty@school.edu" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
           <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/faculty/login" className="underline hover:text-primary">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
