import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full min-h-dvh">
        <Header />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
