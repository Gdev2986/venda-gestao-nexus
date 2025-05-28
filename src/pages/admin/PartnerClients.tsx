
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Partner, Client } from "@/types";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

const PartnerClients = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientCounts, setClientCounts] = useState<Record<string, number>>({});
  const [machineCounts, setMachineCounts] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch partners
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('partners')
          .select('*');

        if (error) throw error;

        if (data) {
          setPartners(data);
          // Select first partner by default
          if (data.length > 0 && !selectedPartner) {
            setSelectedPartner(data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Fetch client counts for each partner
  useEffect(() => {
    const fetchClientCounts = async () => {
      try {
        if (partners.length === 0) return;
        
        const counts: Record<string, number> = {};
        
        // This could be optimized with a single query using group by
        // but for now we'll do individual queries for each partner
        for (const partner of partners) {
          const { count, error } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('partner_id', partner.id);
            
          if (error) throw error;
          counts[partner.id] = count || 0;
        }
        
        setClientCounts(counts);
      } catch (error) {
        console.error("Error fetching client counts:", error);
      }
    };
    
    fetchClientCounts();
  }, [partners]);

  // Fetch clients for selected partner
  useEffect(() => {
    const fetchClients = async () => {
      if (!selectedPartner) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('partner_id', selectedPartner.id);
          
        if (error) throw error;
        
        if (data) {
          setClients(data);
          // Now fetch machine counts for each client
          fetchMachineCounts(data.map(c => c.id));
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [selectedPartner]);

  // Fetch machine counts for clients
  const fetchMachineCounts = async (clientIds: string[]) => {
    try {
      const counts: Record<string, number> = {};
      
      // Another place for optimization with a group by query
      for (const clientId of clientIds) {
        const { count, error } = await supabase
          .from('machines')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', clientId);
          
        if (error) throw error;
        counts[clientId] = count || 0;
      }
      
      setMachineCounts(counts);
    } catch (error) {
      console.error("Error fetching machine counts:", error);
    }
  };

  // Filter partners based on search term
  const filteredPartners = partners.filter(partner => 
    partner.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals for the footer
  const totalClients = clients.length;
  const totalMachines = Object.values(machineCounts).reduce((sum, count) => sum + count, 0);
  const totalBalance = clients.reduce((sum, client) => sum + (client.balance || 0), 0);

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Parceiros e Clientes" 
        description="Gerenciamento dos parceiros e clientes vinculados"
      />

      <div className="mt-8 grid lg:grid-cols-12 gap-6">
        {/* Partners Table - Smaller column */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Parceiros</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(PATHS.ADMIN.PARTNER_NEW)}
                >
                  Novo Parceiro
                </Button>
              </div>
              <div className="mt-2">
                <Input
                  placeholder="Buscar parceiros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-full"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                // Loading state
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredPartners.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {filteredPartners.map((partner) => (
                    <div
                      key={partner.id}
                      onClick={() => setSelectedPartner(partner)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPartner?.id === partner.id
                          ? "border-primary bg-primary/10"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="font-medium">{partner.company_name}</div>
                      <div className="text-sm text-muted-foreground">
                        Clientes cadastrados: {clientCounts[partner.id] || 0}
                      </div>
                      <div className="mt-1 text-xs">
                        Taxa de comissão: {(partner.commission_rate || 0) * 100}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? "Nenhum parceiro encontrado" : "Nenhum parceiro cadastrado"}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-between">
              <div className="text-sm">Total de parceiros: {filteredPartners.length}</div>
            </CardFooter>
          </Card>
        </div>

        {/* Clients Table - Larger column */}
        <div className="lg:col-span-8">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Clientes {selectedPartner && `de ${selectedPartner.company_name}`}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedPartner ? `Exibindo ${clients.length} clientes vinculados` : "Selecione um parceiro"}
                  </p>
                </div>
                {selectedPartner && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(PATHS.ADMIN.PARTNER_DETAILS(selectedPartner?.id))}
                  >
                    Ver Detalhes
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Máquinas</TableHead>
                    <TableHead>Bloco de Taxas</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading state
                    [1, 2, 3, 4].map((i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : selectedPartner && clients.length > 0 ? (
                    clients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">
                            {client.business_name || client.company_name}
                          </div>
                          <div className="text-xs text-muted-foreground">{client.document}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {machineCounts[client.id] || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {client.fee_plan_id ? (
                            <Badge variant="secondary">Personalizado</Badge>
                          ) : (
                            <Badge variant="outline">Padrão</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span className={client.balance && client.balance < 0 ? "text-destructive" : "text-emerald-600"}>
                            R$ {(client.balance || 0).toFixed(2).replace('.', ',')}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        {selectedPartner ? "Nenhum cliente vinculado" : "Selecione um parceiro para ver os clientes"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t pt-3 flex flex-col sm:flex-row sm:justify-between">
              <div className="flex gap-x-4 gap-y-2 flex-wrap">
                <div className="text-sm">
                  <strong>Total de Clientes:</strong> {totalClients}
                </div>
                <div className="text-sm">
                  <strong>Total de Máquinas:</strong> {totalMachines}
                </div>
              </div>
              <div className="text-sm font-medium mt-2 sm:mt-0">
                <strong>Saldo Total:</strong>{" "}
                <span className={totalBalance < 0 ? "text-destructive" : "text-emerald-600"}>
                  R$ {totalBalance.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerClients;
