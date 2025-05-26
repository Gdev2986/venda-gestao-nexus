
import React from 'react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const AppSidebar = ({ children, className }: AppSidebarProps) => {
  return (
    <div className={cn("flex flex-col h-full bg-background border-r", className)}>
      {children}
    </div>
  );
};
