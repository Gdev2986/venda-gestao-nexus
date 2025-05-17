
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

        setUser(data);
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
