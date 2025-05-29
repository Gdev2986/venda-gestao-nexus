
import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNavigation from '@/components/navigation/SidebarNavigation';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <SidebarNavigation />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
