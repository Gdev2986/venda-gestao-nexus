
import { useContext } from 'react';
import { NotificationsContext, NotificationsContextType } from '@/contexts/NotificationsContext';

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  
  return context;
};
