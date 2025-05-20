
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Notification } from "./types";

export const fetchUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Notification[];
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to load notifications."
    });
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to mark notification as read. Try again."
    });
    return false;
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to mark all notifications as read. Please try again."
    });
    return false;
  }
};

export const deleteUserNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to delete notification."
    });
    return false;
  }
};

export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
    
    return data?.role || null;
  } catch (err) {
    console.error("Error in getUserRole:", err);
    return null;
  }
};
