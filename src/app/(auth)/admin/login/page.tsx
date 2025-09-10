
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
import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("admin@school.edu");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(auth, email, password);
      toast({ title: "Login Successful" });
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <Input id="email" type="email" placeholder="admin@school.edu" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/admin/register" className="underline hover:text-primary">
              Register
            </Link>
          </p>
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
