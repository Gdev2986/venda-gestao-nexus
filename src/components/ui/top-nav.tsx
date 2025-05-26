
import React from 'react';
import { cn } from '@/lib/utils';

interface TopNavProps {
  children: React.ReactNode;
  className?: string;
}

export const TopNav = ({ children, className }: TopNavProps) => {
  return (
    <nav className={cn("flex items-center justify-between px-4 py-2 border-b", className)}>
      {children}
    </nav>
  );
};
