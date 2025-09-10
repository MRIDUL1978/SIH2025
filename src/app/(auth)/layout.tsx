import { Icons } from "@/components/icons";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-muted/50 p-4">
       <div className="absolute top-4 left-4">
         <Link href="/" className="flex items-center gap-2">
           <Icons.logo className="h-8 w-8" />
           <span className="text-xl font-headline font-bold">AttendEase</span>
         </Link>
       </div>
      {children}
    </main>
  );
}
