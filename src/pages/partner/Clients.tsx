
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { usePartnerClients } from '@/hooks/use-partner-clients';
import { Loader2 } from 'lucide-react';
import ClientsTable from "@/components/clients/ClientsTable";
import { Client } from '@/types';
import { useAuth } from '@/hooks/use-auth';

const PartnerClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clients, isLoading, error } = usePartnerClients(user?.id || '');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  
  // Filter clients based on search term
  useEffect(() => {
    if (!clients) {
      setFilteredClients([]);
      return;
    }
    
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = clients.filter(client => 
      (client.business_name && client.business_name.toLowerCase().includes(term)) ||
      (client.contact_name && client.contact_name.toLowerCase().includes(term)) ||
      (client.email && client.email.toLowerCase().includes(term))
    );
    
    setFilteredClients(filtered);
  }, [clients, searchTerm]);
  
  const handleViewClient = (clientId: string) => {
    navigate(`/partner/clients/${clientId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meus Clientes"
        description="Gerenciar seus clientes cadastrados"
      />
      
      <div className="flex items-center justify-between">
        <div className="max-w-sm flex-1">
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <p className="text-destructive">Erro ao carregar clientes: {error.toString()}</p>
            </div>
          ) : (
            <ClientsTable 
              clients={filteredClients} 
              isLoading={isLoading}
              onViewClient={handleViewClient}
              isPartnerView={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerClients;
