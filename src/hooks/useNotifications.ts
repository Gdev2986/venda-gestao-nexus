
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import { Notification } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "./use-user";
import { NotificationType } from "@/types/enums";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const { user } = useUser();
  const PAGE_SIZE = 10;

  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);
      
      if (error) throw error;
      
      // Map the data to the Notification type
      const formattedNotifications = data.map(item => ({
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type as NotificationType,
        created_at: item.created_at,
        is_read: item.is_read,
        data: item.data,
        // Add aliases for backward compatibility
        read: item.is_read,
        timestamp: item.created_at
      }));
      
      setNotifications(formattedNotifications);
      setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load notifications'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true, read: true } 
            : notification
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark notification as read'
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      // Update the local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true, read: true }))
      );
      
      toast({
        title: 'Success',
        description: 'All notifications marked as read'
      });
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark all notifications as read'
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, currentPage]);

  return {
    notifications,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};

export default useNotifications;
