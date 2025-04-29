import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash, Building, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { formatDate, formatCNPJ, formatPhone, formatCEP } from "@/utils/client-utils";
import { useClients } from "@/hooks/use-clients";
import { Client } from "@/types";
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
import { Skeleton } from "@/components/ui/skeleton";

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, deleteClient, updateClient, loading } = useClients();
  const [client, setClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const loadClient = async () => {
        try {
          const foundClient = await getClientById(id);
          setClient(foundClient);
        } catch (error) {
          console.error("Error loading client:", error);
        }
      };
      
      loadClient();
    }
  }, [id, getClientById]);

  const handleBack = () => {
    navigate("/clients");
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteClient(id);
        navigate("/clients");
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (id) {
      try {
        const updatedClient = await updateClient(id, data);
        if (updatedClient) {
          setClient(updatedClient);
        }
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating client:", error);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!client) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-2">Cliente não encontrado</h1>
          <p className="text-muted-foreground mb-4">
            O cliente que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={handleBack}>Voltar para a lista</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button onClick={handleBack} size="sm" variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">{client.business_name}</h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="w-4 h-4 mr-1" />
              Excluir
            </Button>
          </div>
        </div>

        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>Editar cliente</CardTitle>
              <CardDescription>
                Atualize as informações do cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientForm
                id="edit-client-form"
                initialData={client}
                onSubmit={handleUpdate}
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                submitButtonText="Salvar alterações"
              />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="machines">Equipamentos</TabsTrigger>
              <TabsTrigger value="sales">Vendas</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do cliente</CardTitle>
                  <CardDescription>
                    Dados cadastrais e de contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Dados da empresa</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Building className="w-4 h-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="font-medium">{client.business_name}</p>
                            {client.document && <p className="text-sm text-muted-foreground">
                              CNPJ: {formatCNPJ(client.document)}
                            </p>}
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Cliente desde: {client.created_at ? formatDate(client.created_at) : "Data não disponível"}
                            </p>
                            {client.updated_at && (
                              <p className="text-sm text-muted-foreground">
                                Última atualização: {formatDate(client.updated_at)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Contato</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="font-medium">{client.contact_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatPhone(client.phone)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm">{client.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-3">Endereço</h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                      <div>
                        <p>{client.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.city}, {client.state} - CEP: {formatCEP(client.zip)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="machines">
              <Card>
                <CardHeader>
                  <CardTitle>Equipamentos</CardTitle>
                  <CardDescription>
                    Equipamentos registrados para este cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Building className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Nenhum equipamento registrado</h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-2">
                      Este cliente ainda não possui equipamentos registrados. Você pode adicionar um novo equipamento para este cliente.
                    </p>
                    <Button className="mt-4">
                      Adicionar equipamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas</CardTitle>
                  <CardDescription>
                    Histórico de vendas deste cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Building className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Nenhuma venda registrada</h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-2">
                      Este cliente ainda não possui vendas registradas. As vendas serão exibidas aqui quando forem processadas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Pagamentos</CardTitle>
                  <CardDescription>
                    Histórico de pagamentos deste cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Building className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Nenhum pagamento registrado</h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-2">
                      Este cliente ainda não possui pagamentos registrados. Os pagamentos serão exibidos aqui quando forem processados.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir o cliente {client.business_name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default ClientDetailPage;
