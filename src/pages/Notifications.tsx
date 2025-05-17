
import { PageWrapper } from '@/components/page/PageWrapper';
import { PageHeader } from '@/components/page/PageHeader';
import { useNotifications } from '@/hooks/use-notifications';
import NotificationList from '@/components/notifications/NotificationList';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Notifications = () => {
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAsUnread, 
    markAllAsRead, 
    refreshNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all');
  
  // Filter notifications based on selected filter
  const filteredNotifications = filter === 'all' 
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader 
          title="Notifications" 
          description="View and manage your notifications"
        />
        
        <div className="flex items-center justify-between">
          <NotificationFilters
            filter={filter}
            setFilter={setFilter}
          />
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={refreshNotifications}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              onClick={markAllAsRead}
              disabled={loading || notifications.filter(n => !n.read).length === 0}
            >
              Mark All as Read
            </Button>
          </div>
        </div>
        
        <NotificationList
          notifications={filteredNotifications}
          isLoading={loading}
          onMarkAsRead={markAsRead}
          onMarkAsUnread={markAsUnread}
        />
      </div>
    </PageWrapper>
  );
};

export default Notifications;
