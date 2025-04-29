
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus, Search, Edit, Trash2 } from "lucide-react";

// Mock data
const mockClients = [
  { id: "1", business_name: "Empresa A", document: "12345678901234", partner_id: "1" },
  { id: "2", business_name: "Empresa B", document: "23456789012345", partner_id: null },
  { id: "3", business_name: "Empresa C", document: "34567890123456", partner_id: "2" },
  { id: "4", business_name: "Empresa D", document: "45678901234567", partner_id: null },
];

const mockPartners = [
  { id: "1", company_name: "Parceiro Alpha" },
  { id: "2", company_name: "Parceiro Beta" },
  { id: "3", company_name: "Parceiro Gamma" },
];

const formSchema = z.object({
  business_name: z.string().min(3, { message: "Nome da empresa é obrigatório" }),
  document: z.string().min(11, { message: "Documento inválido" }),
  partner_id: z.string().optional(),
});

type ClientFormValues = z.infer<typeof formSchema>;

const ClientForm = ({ isOpen, onClose, onSubmit, initialData, title = "Novo Cliente" }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: Partial<ClientFormValues> = {
    business_name: initialData?.business_name || "",
    document: initialData?.document || "",
    partner_id: initialData?.partner_id || undefined,
  };

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: ClientFormValues) => {
    try {
      setIsLoading(true);
      onSubmit(data);
      toast({
        title: initialData ? "Cliente atualizado" : "Cliente cadastrado",
        description: initialData
          ? "O cliente foi atualizado com sucesso."
          : "O cliente foi cadastrado com sucesso.",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao salvar o cliente. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente abaixo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ/CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="CNPJ ou CPF" {...field} />
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
                  <FormLabel>Parceiro (opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um parceiro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {mockPartners.map((partner) => (
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
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const Clients = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const { toast } = useToast();

  const filteredClients = clients.filter((client) =>
    client.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.document.includes(searchQuery)
  );

  const handleAddClient = (data) => {
    const newClient = {
      id: `${clients.length + 1}`,
      ...data,
    };
    setClients([...clients, newClient]);
  };

  const handleEditClient = (data) => {
    const updatedClients = clients.map((client) =>
      client.id === selectedClient.id ? { ...client, ...data } : client
    );
    setClients(updatedClients);
  };

  const handleDeleteClient = (clientId) => {
    const updatedClients = clients.filter((client) => client.id !== clientId);
    setClients(updatedClients);
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso.",
    });
  };

  const getPartnerName = (partnerId) => {
    if (!partnerId) return "Nenhum";
    const partner = mockPartners.find((p) => p.id === partnerId);
    return partner ? partner.company_name : "Desconhecido";
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddClientOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg">Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Empresa</TableHead>
                    <TableHead>CNPJ/CPF</TableHead>
                    <TableHead>Parceiro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.business_name}</TableCell>
                        <TableCell>{client.document}</TableCell>
                        <TableCell>{getPartnerName(client.partner_id)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedClient(client);
                                setIsEditClientOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteClient(client.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        Nenhum cliente encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {isAddClientOpen && (
        <ClientForm
          isOpen={isAddClientOpen}
          onClose={() => setIsAddClientOpen(false)}
          onSubmit={handleAddClient}
        />
      )}

      {isEditClientOpen && selectedClient && (
        <ClientForm
          isOpen={isEditClientOpen}
          onClose={() => setIsEditClientOpen(false)}
          onSubmit={handleEditClient}
          initialData={selectedClient}
          title="Editar Cliente"
        />
      )}
    </MainLayout>
  );
};

export default Clients;
