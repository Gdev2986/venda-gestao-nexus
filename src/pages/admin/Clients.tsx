import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Client,
  ClientCreate,
  ClientUpdate,
  SupabaseClientRow,
} from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';

// Define the client form schema using Zod
const clientFormSchema = z.object({
  business_name: z.string().min(2, {
    message: "Nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  contact_name: z.string().min(2, {
    message: "Nome do contato deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  phone: z.string().min(8, {
    message: "Telefone deve ter pelo menos 8 caracteres.",
  }),
  document: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  partner_id: z.string().optional(),
});

// Define the type for the form values
type ClientFormValues = z.infer<typeof clientFormSchema>;

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [partners, setPartners] = useState<{ id: string; company_name: string; }[]>([]);
  const [filteredClients, setFilteredClients] = useState(clients);
  
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      business_name: "",
      contact_name: "",
      email: "",
      phone: "",
      document: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      partner_id: "",
    },
  });

  // Fetch clients from Supabase
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes.",
        });
      }

      if (data) {
        // Type assertion to ensure data matches the Client type
        setClients(data as Client[]);
        setFilteredClients(data as Client[]);
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar os clientes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch partners for the select dropdown
  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('id, company_name')
        .order('company_name', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setPartners(data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar parceiros",
        description: "Não foi possível carregar a lista de parceiros."
      });
    }
  };

  // Fetch a client by ID
  const getClientById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao carregar cliente",
          description: "Não foi possível carregar os detalhes do cliente.",
        });
        return null;
      }

      return data as Client;
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar os detalhes do cliente.",
      });
      return null;
    }
  };

  // Add a new client
  const addClient = async (client: ClientCreate) => {
    try {
      const clientId = uuidv4();
      const { error } = await supabase
        .from("clients")
        .insert({
          id: clientId,
          ...client,
          status: "active", // Set default status
        } as SupabaseClientRow);

      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao adicionar cliente",
          description: "Não foi possível adicionar o cliente.",
        });
        return false;
      }

      toast({
        title: "Cliente adicionado",
        description: "O cliente foi adicionado com sucesso.",
      });
      setOpen(false);
      fetchClients(); // Refresh the client list
      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao adicionar o cliente.",
      });
      return false;
    }
  };

  // Update an existing client
  const updateClient = async (id: string, updates: ClientUpdate) => {
    try {
      const { error } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", id);

      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao atualizar cliente",
          description: "Não foi possível atualizar o cliente.",
        });
        return false;
      }

      toast({
        title: "Cliente atualizado",
        description: "O cliente foi atualizado com sucesso.",
      });
      fetchClients(); // Refresh the client list
      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao atualizar o cliente.",
      });
      return false;
    }
  };

  // Delete a client
  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Erro ao excluir cliente",
          description: "Não foi possível excluir o cliente.",
        });
        return false;
      }

      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      });
      fetchClients(); // Refresh the client list
      return true;
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao excluir o cliente.",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchClients();
    fetchPartners();
  }, []);

  const filterClients = (filterValue: string) => {
    if (!filterValue) {
      setFilteredClients(clients);
      return;
    }
    
    const filtered = clients.filter(client => 
      client.business_name.toLowerCase().includes(filterValue.toLowerCase()) ||
      client.email?.toLowerCase().includes(filterValue.toLowerCase()) ||
      client.contact_name?.toLowerCase().includes(filterValue.toLowerCase())
    );
    
    setFilteredClients(filtered);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>
          Gerencie os clientes da sua plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <Input
            type="search"
            placeholder="Buscar cliente..."
            onChange={(e) => filterClients(e.target.value)}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Cliente</DialogTitle>
                <DialogDescription>
                  Crie um novo cliente para sua plataforma.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(addClient)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Empresa</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da empresa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Contato</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do contato" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documento (CNPJ/CPF)</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, número, complemento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="São Paulo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="00000-000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partner_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parceiro (Opcional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um parceiro" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Nenhum</SelectItem>
                            {partners.map(partner => (
                              <SelectItem key={partner.id} value={partner.id}>
                                {partner.company_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Adicionar</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        {isLoading ? (
          <div>Carregando clientes...</div>
        ) : error ? (
          <div>Erro: {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nome da Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.business_name}</TableCell>
                    <TableCell>{client.contact_name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminClients;
