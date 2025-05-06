
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientForm } from "@/components/clients/ClientForm";
import { useClients } from "@/hooks/use-clients";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/routes/paths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Download, UserPlus } from "lucide-react";
import { Client } from "@/types";

const NewClient = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { addClient, clients } = useClients();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Implement filtering if available in the hook
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newClient = await addClient(data);
      
      toast({
        title: "Cliente cadastrado",
        description: "Cliente cadastrado com sucesso!"
      });
      
      setIsCreateModalOpen(false);
      return true;
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: error.message || "Ocorreu um erro ao cadastrar o cliente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulated data for the sample stats
  const totalClients = clients?.length || 0;
  const activeClients = clients?.filter(c => c.status === 'ACTIVE').length || 0;
  const averageBalance = clients && clients.length > 0
    ? (clients.reduce((sum, c) => sum + (c.balance || 0), 0) / clients.length).toFixed(2)
    : "0.00";

  return (
    <div className="container mx-auto py-10 space-y-6">
      <PageHeader 
        title="Clientes" 
        description="Gerencie os clientes do sistema"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-muted-foreground text-sm">Total de Clientes</div>
            <div className="text-3xl font-bold mt-1">{totalClients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-muted-foreground text-sm">Clientes Ativos</div>
            <div className="text-3xl font-bold mt-1">{activeClients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-muted-foreground text-sm">Saldo Médio</div>
            <div className="text-3xl font-bold mt-1">R$ {averageBalance}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-8 bg-background w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Exportar PDF</span>
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </Button>
          
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Novo Cliente</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {clients && clients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Documento</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Telefone</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.slice(0, 5).map((client) => (
                    <tr key={client.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{client.business_name}</td>
                      <td className="py-3 px-4">{client.document || '-'}</td>
                      <td className="py-3 px-4">{client.email || '-'}</td>
                      <td className="py-3 px-4">{client.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          client.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`${PATHS.ADMIN.CLIENTS}/${client.id}`)}>
                          Ver detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => navigate(PATHS.ADMIN.CLIENTS)}>
                    Ver todos os clientes
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {searchTerm ? 'Nenhum cliente encontrado para esta busca.' : 'Nenhum cliente cadastrado.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Form Dialog */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]">
            <Card>
              <CardHeader>
                <CardTitle>Novo Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <ClientForm
                  id="new-client-form"
                  isOpen={isCreateModalOpen}
                  onClose={() => setIsCreateModalOpen(false)}
                  onSubmit={handleSubmit}
                  submitButtonText="Cadastrar cliente"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewClient;
