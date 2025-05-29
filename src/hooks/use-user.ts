
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
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
  const { user: authUser, profile, userRole } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser || !profile) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Transform the profile data to match the UserProfile type
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as UserRole,
          avatar_url: profile.avatar,
          phone: profile.phone
        };

        // Fetch client_id if needed
        if (profile.role === UserRole.CLIENT) {
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
  }, [authUser, profile, userRole]);

  return { user, isLoading, error };
}
