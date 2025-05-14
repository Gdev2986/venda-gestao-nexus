
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PATHS } from "@/routes/paths";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import ClientsTable from "@/components/clients/ClientsTable";

// Define simplified client type
interface PartnerClient {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

const PartnerClients = () => {
  const [clients, setClients] = useState<PartnerClient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPartnerClients = async () => {
      try {
        setLoading(true);
        
        // First, get the partner profile
        const { data: partnerData, error: partnerError } = await supabase
          .from('partners')
          .select('id')
          .eq('id', user?.id)
          .single();
        
        if (partnerError || !partnerData) {
          throw new Error('Partner profile not found');
        }
        
        // Then fetch clients associated with this partner
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('partner_id', partnerData.id);
        
        if (error) throw error;
        
        setClients(data || []);
      } catch (error) {
        console.error('Error fetching partner clients:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar seus clientes. Tente novamente mais tarde."
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchPartnerClients();
    }
  }, [user, toast]);
  
  const handleViewClient = (id: string) => {
    navigate(PATHS.PARTNER.CLIENT_DETAILS(id));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Meus Clientes</h1>
      
      <ClientsTable 
        clients={clients}
        onViewClient={handleViewClient}
        isPartnerView
      />
      
      {clients.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Você ainda não possui clientes cadastrados.</p>
        </div>
      )}
    </div>
  );
};

export default PartnerClients;
