
import React from 'react';
import AuthProvider from './AuthProvider';
import { NotificationsProvider } from '@/contexts/notifications/NotificationsContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <AuthProvider>
      <NotificationsProvider>
        {children}
      </NotificationsProvider>
    </AuthProvider>
  );
};
