
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientForm } from "@/components/clients/ClientForm";

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
}

const ClientRegister = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
            partner_id: "1"
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
    try {
      if (id) {
        // Update existing client logic
        toast({
          title: "Cliente atualizado",
          description: "O cliente foi atualizado com sucesso."
        });
      } else {
        // Create new client logic
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
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {id ? "Editar Cliente" : "Novo Cliente"}
          </h2>
        </div>

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
              <div className="flex justify-center items-center p-6">
                <p>Carregando...</p>
              </div>
            ) : (
              <ClientForm
                initialData={client || {
                  business_name: "",
                  contact_name: "",
                  email: "",
                  phone: "",
                  address: "",
                  city: "",
                  state: "",
                  zip: "",
                  partner_id: ""
                }}
                onSubmit={handleSubmit}
                partners={partners}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ClientRegister;
