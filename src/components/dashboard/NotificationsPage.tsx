import React from 'react';
import { Bell, Heart, MessageCircle, Briefcase, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications, useMarkAllRead } from '@/hooks/useNotifications';

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
    case 'like': return (
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <Heart className="w-5 h-5 text-red-500" />
      </div>
    );
    case 'comment': return (
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <MessageCircle className="w-5 h-5 text-blue-500" />
      </div>
    );
    case 'message': return (
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
        <MessageCircle className="w-5 h-5 text-green-500" />
      </div>
    );
    case 'opportunity': return (
      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
        <Briefcase className="w-5 h-5 text-orange-500" />
      </div>
    );
    default: return (
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
        <Bell className="w-5 h-5 text-muted-foreground" />
      </div>
    );
  }
}

export function NotificationsPage() {
  const notifications = useNotifications();
  const markAllRead = useMarkAllRead();
  const notificationList = notifications.data?.notifications ?? [];

  const handleClearAll = () => {
    markAllRead.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {notificationList.length} total notifications
          </p>
        </div>
        {notificationList.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="card-elevated overflow-hidden">
        {notificationList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">All caught up!</h3>
            <p className="text-sm text-muted-foreground">
              You have no notifications yet. When someone likes or comments on your post, it will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notificationList.map((n: any) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-5 py-4 hover:bg-muted/50 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}
              >
                {getNotificationIcon(n.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(new Date(n.createdAt))}
                  </p>
                </div>
                {!n.isRead && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}