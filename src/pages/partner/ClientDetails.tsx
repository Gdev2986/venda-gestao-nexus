
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Sale, PaymentMethod } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const ClientDetails = () => {
  const { clientId } = useParams();
  const [sales, setSales] = useState<Sale[]>([]);
  
  useEffect(() => {
    const fetchSales = async () => {
      try {
        // Mock API call or actual data fetching
        const response = await fetch(`/api/clients/${clientId}/sales`);
        const data = await response.json();
        
        // Transform the data to match the Sale type 
        const transformedSales: Sale[] = data.map((sale: any) => ({
          ...sale,
          client_name: sale.client_name || "Unknown Client"
        }));
        
        setSales(transformedSales);
      } catch (error) {
        console.error("Error fetching sales:", error);
        
        // If API fails, use Supabase as fallback
        try {
          const { data: supabaseData, error: supabaseError } = await supabase
            .from('sales')
            .select(`
              *,
              clients(business_name)
            `)
            .eq('client_id', clientId);
            
          if (supabaseError) throw supabaseError;
          
          if (supabaseData) {
            // Transform to match the Sale type
            const transformedData: Sale[] = supabaseData.map(sale => ({
              id: sale.id,
              code: sale.code,
              terminal: sale.terminal,
              client_name: sale.clients?.business_name || "Unknown Client",
              gross_amount: sale.gross_amount,
              net_amount: sale.net_amount,
              date: sale.date,
              payment_method: sale.payment_method as PaymentMethod, // Type cast to PaymentMethod enum
              client_id: sale.client_id,
              created_at: sale.created_at,
              updated_at: sale.updated_at
            }));
            
            setSales(transformedData);
          }
        } catch (supabaseError) {
          console.error("Error fetching from Supabase:", supabaseError);
        }
      }
    };
    
    if (clientId) {
      fetchSales();
    }
  }, [clientId]);
  
  return (
    <div>
      <h1>Client Details</h1>
      {/* Rest of component */}
    </div>
  );
};

export default ClientDetails;
