import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  Search, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronLeft,
  GraduationCap,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: Home, label: 'Feed', path: '/dashboard' },
  { icon: Users, label: 'Community', path: '/dashboard/community' },
  { icon: Search, label: 'Discover', path: '/dashboard/discover' },
  { icon: Briefcase, label: 'Opportunities', path: '/dashboard/opportunities' },
  { icon: Crown, label: 'Find CEO', path: '/dashboard/find-ceo' },
  { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center")}>
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-foreground whitespace-nowrap">CampusConnect</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("flex-shrink-0", isCollapsed && "hidden")}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "nav-link",
                isActive && "active",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <NavLink
          to="/dashboard/notifications"
          className={cn("nav-link", isCollapsed && "justify-center px-0")}
        >
          <Bell className="w-5 h-5" />
          {!isCollapsed && <span>Notifications</span>}
        </NavLink>
        <NavLink
          to="/dashboard/settings"
          className={cn("nav-link", isCollapsed && "justify-center px-0")}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={logout}
          className={cn("nav-link w-full text-destructive hover:text-destructive hover:bg-destructive/10", isCollapsed && "justify-center px-0")}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* User Profile */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.collegeName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Toggle Button */}
      {isCollapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      )}
    </aside>
  );
}
