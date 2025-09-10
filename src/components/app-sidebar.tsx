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
  BookUser,
  UserCog,
  ShieldCheck,
  LogOut,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const studentNav = [
  { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/student/check-in', icon: QrCode, label: 'Check-In' },
];

const facultyNav = [
  { href: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

const adminNav = [
  { href: '/admin/dashboard', icon: BarChart3, label: 'Analytics' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const role = pathname.split('/')[1] || 'student';

  let navItems, roleIcon, roleName, user, avatarUrl;

  switch (role) {
    case 'student':
      navItems = studentNav;
      roleIcon = <BookUser className="h-5 w-5 shrink-0" />;
      roleName = 'Student';
      user = 'Alice Johnson';
      avatarUrl = 'https://picsum.photos/seed/1/100/100'
      break;
    case 'faculty':
      navItems = facultyNav;
      roleIcon = <UserCog className="h-5 w-5 shrink-0" />;
      roleName = 'Faculty';
      user = 'Dr. Turing';
      avatarUrl = 'https://picsum.photos/seed/faculty/100/100'
      break;
    case 'admin':
      navItems = adminNav;
      roleIcon = <ShieldCheck className="h-5 w-5 shrink-0" />;
      roleName = 'Admin';
      user = 'Admin User';
      avatarUrl = 'https://picsum.photos/seed/admin/100/100'
      break;
    default:
      navItems = [];
      roleIcon = null;
      roleName = '';
      user = 'Guest'
      avatarUrl = ''
  }

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
                  isActive={pathname === item.href}
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
             <Link href="/">
                <SidebarMenuButton tooltip={{ children: "Logout", side: 'right' }}>
                    <LogOut className="shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2">
            <div className="h-px w-full bg-border" />
        </div>
        <div className="flex items-center gap-3 p-2">
            <Avatar className='size-9'>
                <AvatarImage src={avatarUrl} alt={user} />
                <AvatarFallback>{user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">{user}</span>
                <span className="text-xs text-muted-foreground">{roleName}</span>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
