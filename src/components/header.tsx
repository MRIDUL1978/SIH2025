import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
      <SidebarTrigger />
      <h1 className="text-lg font-headline font-semibold">AttendEase</h1>
    </header>
  );
}
