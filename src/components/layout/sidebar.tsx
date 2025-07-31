import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  BarChart3, 
  FolderKanban, 
  UserCog, 
  Clock, 
  PieChart, 
  Settings, 
  LogOut,
  Menu,
  X,
  Calendar,
  Target
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isManager = user?.type === 'Manager';

  const managerNavItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/manager' },
    { icon: Users, label: 'Engineers', href: '/manager/engineers' },
    { icon: FolderKanban, label: 'Projects', href: '/manager/projects' },
    { icon: UserCog, label: 'Assignments', href: '/manager/assignments' },
    { icon: PieChart, label: 'Team Analytics', href: '/manager/analytics' },
    { icon: Clock, label: 'Capacity Planning', href: '/manager/capacity' },
    { icon: Calendar, label: 'Timeline View', href: '/manager/timeline' },
    { icon: Target, label: 'Skill Gap Analysis', href: '/manager/skill-gap' },
  ];

  const engineerNavItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/engineer' },
    { icon: UserCog, label: 'My Assignments', href: '/engineer/assignments' },
    { icon: FolderKanban, label: 'Projects', href: '/engineer/projects' },
  ];

  const navItems = isManager ? managerNavItems : engineerNavItems;
  
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center h-16 px-4 bg-primary">
        <div className="flex items-center">
          <Users className="text-white text-2xl mr-3" />
          <span className="text-white font-bold text-lg">ERMS</span>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gray-300 text-gray-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.type}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-4">
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main
          </h3>
        </div>
        
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-4 py-3 h-auto font-normal",
                    isActive 
                      ? "bg-gray-100 text-accent border-r-2 border-accent" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className={cn("mr-3 h-4 w-4", isActive && "text-accent")} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="px-4 py-2 mt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Account
          </h3>
        </div>
        
        <div className="space-y-1">
          <Link href="/profile">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start px-4 py-3 h-auto font-normal",
                location === "/profile"
                  ? "bg-gray-100 text-accent"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <Settings className="mr-3 h-4 w-4" />
              Profile
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 h-auto font-normal text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => {
              logout();
              setIsMobileOpen(false);
            }}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile header with hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center">
            <Users className="text-primary text-xl mr-2" />
            <span className="text-primary font-bold text-lg">ERMS</span>
          </div>
          
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <SidebarContent />
      </div>
    </>
  );
}
