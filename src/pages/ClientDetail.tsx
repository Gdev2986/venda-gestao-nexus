
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { ClientForm } from "@/components/clients/ClientForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchClient = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from Supabase
        // For mock data
        setTimeout(() => {
          // Mock client data
          const mockClient: Client = {
            id: id,
            business_name: "Cliente Exemplo",
            contact_name: "João Silva",
            email: "joao@exemplo.com",
            phone: "(11) 98765-4321",
            address: "Rua Exemplo, 123",
            city: "São Paulo",
            state: "SP",
            zip: "01234-567",
            document: "12.345.678/0001-90",
            status: "active"
          };
          
          setClient(mockClient);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching client:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar cliente",
          description: "Não foi possível carregar os dados do cliente."
        });
        setIsLoading(false);
      }
    };
    
    fetchClient();
  }, [id, toast]);

  const handleUpdate = async (data: any) => {
    if (!client) return false;
    
    setIsSubmitting(true);
    try {
      // In a real implementation, this would update Supabase
      // Simulating an API call
      setTimeout(() => {
        setClient({ ...client, ...data });
        setIsEditDialogOpen(false);
        setIsSubmitting(false);
        
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso."
        });
      }, 500);
      
      return true;
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar os dados do cliente."
      });
      setIsSubmitting(false);
      return false;
    }
  };

  const handleDelete = async () => {
    if (!client) return;
    
    setIsSubmitting(true);
    try {
      // In a real implementation, this would delete from Supabase
      // Simulating an API call
      setTimeout(() => {
        setIsDeleteDialogOpen(false);
        setIsSubmitting(false);
        
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso."
        });
        
        navigate("/clients");
      }, 500);
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente."
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(-1)} size="sm" variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Carregando cliente...</h1>
        </div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(-1)} size="sm" variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Cliente não encontrado</h1>
        </div>
        <p>O cliente solicitado não existe ou foi removido.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(-1)} size="sm" variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">{client.business_name}</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsEditDialogOpen(true)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="gap-2"
          >
            <Trash className="w-4 h-4" />
            Excluir
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nome da Empresa</h3>
              <p>{client.business_name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">CNPJ/CPF</h3>
              <p>{client.document || "Não informado"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contato</h3>
              <p>{client.contact_name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{client.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
              <p>{client.phone}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p>{client.status === "active" ? "Ativo" : "Inativo"}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Endereço</h3>
            <p>
              {[
                client.address,
                client.city && client.state && `${client.city}, ${client.state}`,
                client.zip,
              ]
                .filter(Boolean)
                .join(", ") || "Não informado"}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Client Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Editar Cliente</h2>
          <ClientForm
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSubmit={handleUpdate}
            initialData={{
              business_name: client.business_name,
              document: client.document || "",
              contact_name: client.contact_name,
              email: client.email,
              phone: client.phone,
              address: client.address || "",
              city: client.city || "",
              state: client.state || "",
              zip: client.zip || "",
            }}
            isSubmitting={isSubmitting}
            title="Editar Cliente"
          />
        </div>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente {client.business_name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientDetail;
