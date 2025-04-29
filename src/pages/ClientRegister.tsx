
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientForm } from "@/components/clients/ClientForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface Client {
  id?: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  partner_id?: string;
  document?: string;
}

const ClientRegister = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [partners, setPartners] = useState<{id: string, business_name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch partners for dropdown
    const fetchPartners = async () => {
      try {
        // Mock data for now
        setPartners([
          { id: "1", business_name: "Parceiro 1" },
          { id: "2", business_name: "Parceiro 2" },
          { id: "3", business_name: "Parceiro 3" },
        ]);
      } catch (error) {
        console.error("Erro ao carregar parceiros:", error);
      }
    };

    fetchPartners();

    // If there's an ID, fetch the client data
    if (id) {
      const fetchClient = async () => {
        setIsLoading(true);
        try {
          // In a real implementation, this would fetch from Supabase
          // const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
          
          // Mock data for now
          setClient({
            id,
            business_name: "Empresa Teste",
            contact_name: "João Silva",
            email: "joao@empresa.com",
            phone: "(11) 98765-4321",
            address: "Av. Paulista, 1000",
            city: "São Paulo",
            state: "SP",
            zip: "01310-100",
            partner_id: "1",
            document: "12.345.678/0001-90"
          });
        } catch (error) {
          console.error("Erro ao carregar cliente:", error);
          toast({
            variant: "destructive",
            title: "Erro ao carregar dados do cliente",
            description: "Não foi possível carregar os dados do cliente."
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchClient();
    } else {
      setIsLoading(false);
    }
  }, [id, toast]);

  const handleSubmit = async (data: Client) => {
    setIsSaving(true);
    try {
      // In a real implementation, this would save to Supabase
      // if (id) {
      //   await supabase.from('clients').update(data).eq('id', id);
      // } else {
      //   await supabase.from('clients').insert(data);
      // }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (id) {
        toast({
          title: "Cliente atualizado",
          description: "O cliente foi atualizado com sucesso."
        });
      } else {
        toast({
          title: "Cliente cadastrado",
          description: "O cliente foi cadastrado com sucesso."
        });
      }
      navigate("/clients");
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar cliente",
        description: "Ocorreu um erro ao salvar o cliente."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/clients");
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/clients")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">
              {id ? "Editar Cliente" : "Novo Cliente"}
            </h2>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              form="client-form"
              disabled={isLoading || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="machines">Máquinas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>{id ? "Editar Cliente" : "Cadastrar Novo Cliente"}</CardTitle>
                <CardDescription>
                  {id
                    ? "Atualize as informações do cliente selecionado."
                    : "Preencha os dados para cadastrar um novo cliente no sistema."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ) : (
                  <ClientForm
                    id="client-form"
                    initialData={client || {
                      business_name: "",
                      contact_name: "",
                      email: "",
                      phone: "",
                      address: "",
                      city: "",
                      state: "",
                      zip: "",
                      partner_id: "",
                      document: ""
                    }}
                    onSubmit={handleSubmit}
                    partners={partners}
                    isOpen={true}
                    onClose={handleCancel}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="machines">
            <Card>
              <CardHeader>
                <CardTitle>Máquinas do Cliente</CardTitle>
                <CardDescription>
                  Visualize e gerencie as máquinas associadas a este cliente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {id ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      Esta funcionalidade está disponível após salvar o cliente.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      Para gerenciar máquinas, primeiro salve o cliente.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ClientRegister;
