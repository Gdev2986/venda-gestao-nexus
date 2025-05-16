
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export const useAutoCreateClient = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only proceed if a user just signed up
        if (event === "SIGNED_IN" && session?.user) {
          try {
            // Get the user profile to check role
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profileError) throw profileError;

            // Only create client for users with CLIENT role
            if (profile && profile.role === "CLIENT") {
              // Check if client already exists for this user
              const { data: existingClient, error: checkError } = await supabase
                .from("clients")
                .select("id")
                .eq("user_id", session.user.id)
                .maybeSingle();

              if (checkError) throw checkError;

              // If client doesn't exist, create one
              if (!existingClient) {
                const name = profile.name || session.user.email?.split('@')[0] || 'New Client';
                
                const newClient = {
                  id: uuidv4(),
                  user_id: session.user.id,
                  business_name: name,
                  contact_name: name,
                  email: profile.email || session.user.email,
                  phone: profile.phone,
                  status: "active",
                  balance: 0,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };

                const { error: insertError } = await supabase
                  .from("clients")
                  .insert([newClient]);

                if (insertError) throw insertError;

                console.log("Created new client for user:", session.user.id);
                toast({
                  title: "Cliente criado",
                  description: "Sua conta de cliente foi criada com sucesso.",
                });
              }
            }
          } catch (error) {
            console.error("Error auto-creating client:", error);
          }
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [toast]);
};
