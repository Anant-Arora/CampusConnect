import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Briefcase,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  GraduationCap,
  Crown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

const navItems = [
  { icon: Home, label: 'Feed', path: '/dashboard' },
  { icon: Briefcase, label: 'Opportunities', path: '/dashboard/opportunities' },
  { icon: Crown, label: 'Find CEO', path: '/dashboard/find-ceo' },
  { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
];

export function Sidebar({ isCollapsed, isMobileOpen, onToggle, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={cn(
        // Base styles
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        // Desktop width
        isCollapsed ? "lg:w-16" : "lg:w-64",
        // Mobile: always full sidebar width, hidden by default, shown when open
        "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "lg:justify-center")}>
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          {(!isCollapsed) && (
            <span className="font-semibold text-white whitespace-nowrap">CampusConnect</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn("hidden lg:flex flex-shrink-0", isCollapsed && "hidden")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="flex lg:hidden flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={cn(
                "nav-link",
                isActive && "active",
                isCollapsed && "lg:justify-center lg:px-0"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={cn(isCollapsed && "lg:hidden")}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <NavLink
          to="/dashboard/notifications"
          onClick={onMobileClose}
          className={cn("nav-link", isCollapsed && "lg:justify-center lg:px-0")}
        >
          <Bell className="w-5 h-5" />
          <span className={cn(isCollapsed && "lg:hidden")}>Notifications</span>
        </NavLink>
        <NavLink
          to="/dashboard/settings"
          onClick={onMobileClose}
          className={cn("nav-link", isCollapsed && "lg:justify-center lg:px-0")}
        >
          <Settings className="w-5 h-5" />
          <span className={cn(isCollapsed && "lg:hidden")}>Settings</span>
        </NavLink>
        <button
          onClick={() => { logout(); onMobileClose(); }}
          className={cn("nav-link w-full text-destructive hover:text-destructive hover:bg-destructive/10", isCollapsed && "lg:justify-center lg:px-0")}
        >
          <LogOut className="w-5 h-5" />
          <span className={cn(isCollapsed && "lg:hidden")}>Logout</span>
        </button>
      </div>

      {/* User Profile */}
      {user && (
        <div className={cn("p-4 border-t border-sidebar-border", isCollapsed && "lg:hidden")}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              <p className="text-xs text-white/60 truncate">{user.collegeName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Toggle Button - Desktop only */}
      {isCollapsed && (
        <div className="hidden lg:block p-3 border-t border-sidebar-border">
          <Button variant="ghost" size="icon" onClick={onToggle} className="w-full">
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      )}
    </aside>
  );
}