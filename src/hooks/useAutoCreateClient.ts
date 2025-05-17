
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export function useAutoCreateClient() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Only run this effect if we have a user and they're loaded
    if (isLoading || !user) return;

    async function createClientIfNotExists() {
      try {
        // Check if user already has a client record
        const { data: existingAccess } = await supabase
          .from('user_client_access')
          .select('client_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingAccess?.client_id) {
          // User already has client access, no need to create
          console.log('User already has client access:', existingAccess.client_id);
          return;
        }

        // Create a new client record
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            id: crypto.randomUUID(), // Generate a UUID for the client
            business_name: user.email || 'New Client',
            status: 'ACTIVE',
          })
          .select()
          .single();

        if (clientError) {
          console.error('Error creating client:', clientError);
          return;
        }

        // Create user_client_access record to link user to client
        const { error: accessError } = await supabase
          .from('user_client_access')
          .insert({
            user_id: user.id,
            client_id: newClient.id,
          });

        if (accessError) {
          console.error('Error creating client access:', accessError);
          return;
        }

        console.log('Client created successfully:', newClient.id);
      } catch (error) {
        console.error('Error in auto-create client:', error);
      }
    }

    createClientIfNotExists();
  }, [user, isLoading]);
}
