
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
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/firebase/auth';
import { useTheme } from '@/lib/theme-provider';
import { MoonIcon, SunIcon } from 'lucide-react';

type NavItem = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

const studentNav: NavItem[] = [
  { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/student/check-in', icon: QrCode, label: 'Check-In' },
];

const facultyNav: NavItem[] = [
  { href: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/faculty/course', icon: QrCode, label: 'Courses' },
];

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/users', icon: LayoutDashboard, label: 'User Management' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const role = pathname.split('/')[1] || 'student';

  let navItems: NavItem[] = [];
  let roleName = '';
  let userName = '';
  let avatarUrl = '';
  
  const userDisplayName = user?.displayName || user?.email || "User";
  const userAvatarFallback = userDisplayName.charAt(0).toUpperCase();

  switch (role) {
    case 'student':
      navItems = studentNav;
      roleName = 'Student';
      userName = user ? userDisplayName : "Guest";
      avatarUrl = user?.photoURL || `https://picsum.photos/seed/${user?.uid || role}/100/100`;
      break;
    case 'faculty':
      navItems = facultyNav;
      roleName = 'Faculty';
      userName = user ? userDisplayName : "Guest";
      avatarUrl = user?.photoURL || `https://picsum.photos/seed/${user?.uid || role}/100/100`;
      break;
    case 'admin':
      navItems = adminNav;
      roleName = 'Admin';
      userName = user ? userDisplayName : "Guest";
      avatarUrl = user?.photoURL || `https://picsum.photos/seed/${user?.uid || role}/100/100`;
      break;
    default:
      navItems = [];
      roleName = '';
      userName = user ? userDisplayName : "Guest";
      avatarUrl = user?.photoURL || `https://picsum.photos/seed/${user?.uid || role}/100/100`;
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
                <SidebarMenuButton 
                  onClick={toggleTheme}
                  tooltip={{ children: 'Toggle Theme', side: 'right' }}
                >
                  {theme === "light" ? (
                    <MoonIcon className="shrink-0" />
                  ) : (
                    <SunIcon className="shrink-0" />
                  )}
                  <span className="group-data-[collapsible=icon]:hidden">
                    Toggle Theme
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
