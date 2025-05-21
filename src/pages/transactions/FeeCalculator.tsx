
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TransactionFeeCalculator } from "@/components/transactions/TransactionFeeCalculator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const FeeCalculatorPage = () => {
  const [selectedClient, setSelectedClient] = useState<string>("");
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, business_name")
        .order("business_name");
        
      if (error) throw error;
      return data || [];
    }
  });
  
  const selectedClientName = clients.find(c => c.id === selectedClient)?.business_name;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Calculadora de Taxas" 
        description="Calcule as taxas aplicáveis às transações com base no método de pagamento e parcelas"
      />
      
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <Label htmlFor="client-select" className="text-base">Selecione o Cliente</Label>
            <Select
              value={selectedClient}
              onValueChange={setSelectedClient}
              disabled={isLoading}
            >
              <SelectTrigger id="client-select" className="mt-2">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Carregando...</span>
                  </div>
                ) : clients.length === 0 ? (
                  <SelectItem value="no-clients" disabled>
                    Nenhum cliente encontrado
                  </SelectItem>
                ) : (
                  clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.business_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          {selectedClient && (
            <TransactionFeeCalculator 
              clientId={selectedClient}
              clientName={selectedClientName}
            />
          )}
          
          {!selectedClient && (
            <div className="text-center p-6 text-muted-foreground">
              Selecione um cliente para calcular as taxas aplicáveis
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeeCalculatorPage;
