
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn('overflow-x-auto rounded-md border', className)}>
      {children}
    </div>
  );
}

interface ResponsiveCardListProps {
  children: React.ReactNode;
  className?: string;
  showOnBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function ResponsiveCardList({ 
  children, 
  className,
  showOnBreakpoint = 'sm' 
}: ResponsiveCardListProps) {
  const breakpointClasses = {
    'sm': 'sm:hidden',
    'md': 'md:hidden',
    'lg': 'lg:hidden',
    'xl': 'xl:hidden',
    '2xl': '2xl:hidden',
  };
  
  return (
    <div className={cn('space-y-4', breakpointClasses[showOnBreakpoint], className)}>
      {children}
    </div>
  );
}

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveCard({ children, className }: ResponsiveCardProps) {
  return (
    <div className={cn('border rounded-md p-4 space-y-2', className)}>
      {children}
    </div>
  );
}

export function ResponsiveCardHeader({ children, className }: ResponsiveCardProps) {
  return (
    <div className={cn('flex justify-between items-center', className)}>
      {children}
    </div>
  );
}

export function ResponsiveCardTitle({ children, className }: ResponsiveCardProps) {
  return (
    <span className={cn('font-medium', className)}>
      {children}
    </span>
  );
}

export function ResponsiveCardContent({ children, className }: ResponsiveCardProps) {
  return (
    <div className={cn('text-sm', className)}>
      {children}
    </div>
  );
}

export function ResponsiveCardFooter({ children, className }: ResponsiveCardProps) {
  return (
    <div className={cn('flex justify-between mt-2', className)}>
      {children}
    </div>
  );
}

export function ResponsiveCardLabel({ children, className }: ResponsiveCardProps) {
  return (
    <span className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </span>
  );
}

export function ResponsiveCardValue({ children, className }: ResponsiveCardProps) {
  return (
    <span className={cn('font-medium', className)}>
      {children}
    </span>
  );
}
