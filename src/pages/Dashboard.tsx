import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopNav } from '@/components/dashboard/TopNav';
import { CommunityFeed } from '@/components/dashboard/CommunityFeed';
import { OpportunitiesPage } from '@/components/dashboard/OpportunitiesPage';
import { MessagesPage } from '@/components/dashboard/MessagesPage';
import { FindCEOPage } from '@/components/dashboard/FindCEOPage';
import { NotificationsPage } from '@/components/dashboard/NotificationsPage';
import { SettingsPage } from '@/components/dashboard/SettingsPage';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const token = getToken();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const navigateToMessages = (personName: string) => {
    navigate('/dashboard/messages');
  };

  const renderContent = () => {
    switch (location.pathname) {
      case '/dashboard/opportunities':
        return <OpportunitiesPage />;
      case '/dashboard/find-ceo':
        return <FindCEOPage onNavigateToMessages={navigateToMessages} />;
      case '/dashboard/messages':
        return <MessagesPage />;
      case '/dashboard/notifications':
        return <NotificationsPage />;
      case '/dashboard/settings':
        return <SettingsPage />;
      default:
        return <CommunityFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        <TopNav onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
