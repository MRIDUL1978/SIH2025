
'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import {
  LayoutDashboard,
  QrCode,
  BarChart3,
  LogOut,
  Settings,
  BookCopy,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/lib/firebase/auth';

const studentNav = [
  { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/student/check-in', icon: QrCode, label: 'Check-In' },
];

const facultyNav = [
  { href: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

const adminNav = [
  { href: '/admin/dashboard', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/courses', icon: BookCopy, label: 'Manage Courses' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const role = pathname.split('/')[1] || 'student';

  let navItems, roleName, userName, avatarUrl;
  
  const userDisplayName = user?.displayName || user?.email || "User";
  const userAvatarFallback = userDisplayName.charAt(0).toUpperCase();

  switch (role) {
    case 'student':
      navItems = studentNav;
      roleName = 'Student';
      break;
    case 'faculty':
      navItems = facultyNav;
      roleName = 'Faculty';
      break;
    case 'admin':
      navItems = adminNav;
      roleName = 'Admin';
      break;
    default:
      navItems = [];
      roleName = '';
  }
  
  userName = user ? userDisplayName : "Guest";
  avatarUrl = user?.photoURL || `https://picsum.photos/seed/${user?.uid || role}/100/100`;


  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Icons.logo className="size-7 shrink-0 text-primary" />
          <span className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">
            AttendEase
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <item.icon className="shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        {user && (
          <>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="#">
                  <SidebarMenuButton tooltip={{ children: 'Settings', side: 'right' }}>
                    <Settings className="shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Settings
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut} tooltip={{ children: "Logout", side: 'right' }}>
                    <LogOut className="shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="p-2">
                <div className="h-px w-full bg-border" />
            </div>
            <div className="flex items-center gap-3 p-2">
                <Avatar className='size-9'>
                    <AvatarImage src={avatarUrl} alt={userName} />
                    <AvatarFallback>{userAvatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground">{roleName}</span>
                </div>
            </div>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
