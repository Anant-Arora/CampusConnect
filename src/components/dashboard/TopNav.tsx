import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications, useMarkAllRead } from '@/hooks/useNotifications';
import { useGlobalSearch } from '@/hooks/useSearch';

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const notifications = useNotifications();
  const markAllRead = useMarkAllRead();
  const search = useGlobalSearch(q);

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
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => {
            if ((notifications.data?.unreadCount ?? 0) > 0) markAllRead.mutate();
          }}
        >
          <Bell className="w-5 h-5" />
          {(notifications.data?.unreadCount ?? 0) > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          )}
        </Button>
        
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
