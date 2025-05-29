
import React from 'react';
import { NotificationsProvider } from '@/contexts/notifications/NotificationsContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <NotificationsProvider>
      {children}
    </NotificationsProvider>
  );
};
