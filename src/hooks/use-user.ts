
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/enums";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  client_id?: string;
  avatar_url?: string;
  phone?: string;
}

export function useUser() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (error) {
          throw error;
        }

        // Transform the data to match the UserProfile type
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role as UserRole,
          avatar_url: data.avatar,
          phone: data.phone
        };

        // Fetch client_id if needed
        if (data.role === UserRole.CLIENT) {
          const { data: clientData } = await supabase
            .from("user_client_access")
            .select("client_id")
            .eq("user_id", authUser.id)
            .single();
            
          if (clientData) {
            userProfile.client_id = clientData.client_id;
          }
        }

        setUser(userProfile);
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser]);

  return { user, isLoading, error };
}
