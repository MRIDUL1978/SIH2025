import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookUser, ShieldCheck, UserCog } from "lucide-react";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8" />
          <h1 className="text-2xl font-headline font-bold text-foreground">
            AttendEase
          </h1>
        </Link>
        <Button asChild>
          <Link href="/student/login">Get Started</Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Smart, Simple, Secure Attendance
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                AttendEase streamlines attendance tracking for modern educational institutions. Focus on teaching, not on roll calls.
              </p>
            </div>
          </div>
        </section>

        <section id="portals" className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-4xl/tight">
                Access Your Dashboard
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Log in to your dedicated portal to get started.
              </p>
            </div>
            <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/student/login" className="h-full">
                <Card className="flex flex-col items-center justify-center p-6 h-full hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform-gpu">
                  <CardHeader className="items-center p-2">
                    <div className="p-4 bg-accent/20 rounded-full">
                      <BookUser className="w-10 h-10 text-accent-foreground" />
                    </div>
                    <CardTitle className="mt-4 font-headline text-xl">Student Portal</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <p className="text-muted-foreground text-center text-sm">View your attendance and check-in to classes.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/faculty/login" className="h-full">
                <Card className="flex flex-col items-center justify-center p-6 h-full hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform-gpu">
                  <CardHeader className="items-center p-2">
                    <div className="p-4 bg-accent/20 rounded-full">
                      <UserCog className="w-10 h-10 text-accent-foreground" />
                    </div>
                    <CardTitle className="mt-4 font-headline text-xl">Faculty Portal</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <p className="text-muted-foreground text-center text-sm">Manage courses and track student attendance.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/login" className="h-full">
                <Card className="flex flex-col items-center justify-center p-6 h-full hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform-gpu">
                  <CardHeader className="items-center p-2">
                    <div className="p-4 bg-accent/20 rounded-full">
                      <ShieldCheck className="w-10 h-10 text-accent-foreground" />
                    </div>
                    <CardTitle className="mt-4 font-headline text-xl">Admin Portal</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <p className="text-muted-foreground text-center text-sm">Access analytics and institutional insights.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 AttendEase. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
