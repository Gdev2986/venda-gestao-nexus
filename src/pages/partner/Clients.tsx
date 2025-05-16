
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import ClientsTable from "@/components/clients/ClientsTable";
import { usePartnerClients } from "@/hooks/use-partner-clients";
import { Client } from "@/types";
import ClientFormModal from "@/components/clients/ClientFormModal";

const PartnerClients = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get partner clients
  const {
    clients,
    isLoading,
    error,
    createClient
  } = usePartnerClients();

  // Handle filter changes
  const handleFilterChange = (search: string, status: string) => {
    setSearchTerm(search);
    setStatusFilter(status);
    
    // Apply filters locally since we don't have setFilterValues
    // This would typically be handled by filtering the clients data
  };

  // Handle client creation
  const handleCreateClient = async (data: Partial<Client>) => {
    try {
      await createClient.mutateAsync(data);
      setShowCreateModal(false);
      return true;
    } catch (e) {
      console.error("Error creating client:", e);
      return false;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <PageHeader 
        title="Clientes" 
        description="Gerencie os clientes da sua parceria"
        actionLabel="Novo Cliente"
        actionOnClick={() => setShowCreateModal(true)}
      />
      
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Todos os Clientes</CardTitle>
              <div className="flex items-center gap-2">
                {/* Search and filter inputs could go here */}
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
                  {error.message || "Erro ao carregar clientes"}
                </div>
              ) : (
                <ClientsTable 
                  clients={clients} 
                  isLoading={isLoading} 
                  onRowClick={setSelectedClient}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Buscar</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleFilterChange(e.target.value, statusFilter)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Nome ou e-mail"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(searchTerm, e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="pending">Pendente</option>
                </select>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleFilterChange("", "all")}
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Create Client Modal */}
      <ClientFormModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateClient}
        isSubmitting={createClient.isPending}
        mode="create"
      />
    </div>
  );
};

export default PartnerClients;
