import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Bell, Menu, Heart, MessageCircle, Briefcase, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications, useMarkAllRead } from '@/hooks/useNotifications';
import { useGlobalSearch } from '@/hooks/useSearch';

interface TopNavProps {
  onMenuClick: () => void;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'like': return <Heart className="w-4 h-4 text-red-500" />;
    case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'message': return <MessageCircle className="w-4 h-4 text-green-500" />;
    case 'opportunity': return <Briefcase className="w-4 h-4 text-orange-500" />;
    default: return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const notifications = useNotifications();
  const markAllRead = useMarkAllRead();
  const search = useGlobalSearch(q);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.data?.unreadCount ?? 0;
  const notificationList = notifications.data?.notifications ?? [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markAllRead.mutate();
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students, posts, opportunities..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-80 pl-10 pr-4 py-2 rounded-lg bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {q.trim().length >= 2 && search.data && (
            <div className="absolute left-0 right-0 mt-2 card-elevated p-2 z-50 max-h-64 overflow-auto">
              {(search.data.users ?? []).slice(0, 3).map((u: any) => (
                <div key={u.id} className="px-3 py-2 rounded-md hover:bg-muted text-sm">
                  {u.fullName} <span className="text-xs text-muted-foreground">· {u.college}</span>
                </div>
              ))}
              {(search.data.posts ?? []).slice(0, 2).map((p: any) => (
                <div key={p.id} className="px-3 py-2 rounded-md hover:bg-muted text-sm">
                  {String(p.content).slice(0, 60)}
                </div>
              ))}
              {(search.data.opportunities ?? []).slice(0, 2).map((o: any) => (
                <div key={o.id} className="px-3 py-2 rounded-md hover:bg-muted text-sm">
                  {o.title} <span className="text-xs text-muted-foreground">· {o.company}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* About Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAbout(true)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5"
        >
          <Info className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">About</span>
        </Button>

        {/* About Popup Overlay */}
        {showAbout && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAbout(false)}>
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">About CampusConnect</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowAbout(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* App Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                CampusConnect is a college networking platform designed to help students discover opportunities, connect with talented peers, and grow together as a community.
              </p>

              {/* Divider */}
              <div className="border-t border-border mb-6" />

              {/* Developers Section */}
              <h3 className="text-sm font-semibold text-foreground mb-4">👨‍💻 Developed By</h3>
              <div className="space-y-3">

                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Anant Arora</p>
                    <p className="text-xs text-muted-foreground">Btech CSE (Data Science) · Amity University</p>
                  </div>
                </div>

              </div>

              {/* Divider */}
              <div className="border-t border-border mt-6 mb-4" />

              {/* Version */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Version 1.0.0</p>
                <p className="text-xs text-muted-foreground">© 2026 CampusConnect</p>
              </div>

            </div>
          </div>
        )}

        {/* Bell Icon + Notification Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleBellClick}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 card-elevated z-50 overflow-hidden rounded-xl shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {unreadCount} unread
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto">
                {notificationList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <Bell className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground mt-1">No notifications yet</p>
                  </div>
                ) : (
                  notificationList.map((n: any) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}
                    >
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        {getNotificationIcon(n.type)}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-snug">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(new Date(n.createdAt))}
                        </p>
                      </div>
                      {/* Unread dot */}
                      {!n.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">{user?.degree}</p>
          </div>
        </div>
      </div>
    </header>
  );
}