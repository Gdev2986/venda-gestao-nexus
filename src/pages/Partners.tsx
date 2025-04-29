
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
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Users,
  Wallet,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockPartners = [
  { id: "1", company_name: "Parceiro Alpha", commission_rate: 10, total_commission: 1250.50 },
  { id: "2", company_name: "Parceiro Beta", commission_rate: 15, total_commission: 3450.75 },
  { id: "3", company_name: "Parceiro Gamma", commission_rate: 12, total_commission: 2100.25 },
];

const mockClients = [
  { id: "1", business_name: "Empresa A", document: "12345678901234", partner_id: "1", revenue: 12505.00 },
  { id: "2", business_name: "Empresa B", document: "23456789012345", partner_id: null, revenue: 0 },
  { id: "3", business_name: "Empresa C", document: "34567890123456", partner_id: "2", revenue: 23005.00 },
  { id: "4", business_name: "Empresa D", document: "45678901234567", partner_id: null, revenue: 0 },
  { id: "5", business_name: "Empresa E", document: "56789012345678", partner_id: "1", revenue: 8250.50 },
  { id: "6", business_name: "Empresa F", document: "67890123456789", partner_id: "3", revenue: 17502.08 },
];

const mockCommissions = [
  { id: "1", partner_id: "1", amount: 125.05, sale_id: "sale1", is_paid: true, paid_at: "2023-04-15" },
  { id: "2", partner_id: "1", amount: 250.10, sale_id: "sale2", is_paid: true, paid_at: "2023-05-20" },
  { id: "3", partner_id: "1", amount: 175.25, sale_id: "sale3", is_paid: false, paid_at: null },
  { id: "4", partner_id: "2", amount: 345.07, sale_id: "sale4", is_paid: true, paid_at: "2023-06-10" },
  { id: "5", partner_id: "2", amount: 230.05, sale_id: "sale5", is_paid: false, paid_at: null },
  { id: "6", partner_id: "3", amount: 210.02, sale_id: "sale6", is_paid: true, paid_at: "2023-05-05" },
];

const formSchema = z.object({
  company_name: z.string().min(3, { message: "Nome da empresa é obrigatório" }),
  commission_rate: z.coerce.number().min(0).max(100, { message: "Comissão deve estar entre 0 e 100%" }),
});

type PartnerFormValues = z.infer<typeof formSchema>;

const PartnerForm = ({ isOpen, onClose, onSubmit, initialData, title = "Novo Parceiro" }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: Partial<PartnerFormValues> = {
    company_name: initialData?.company_name || "",
    commission_rate: initialData?.commission_rate || 0,
  };

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: PartnerFormValues) => {
    try {
      setIsLoading(true);
      onSubmit(data);
      toast({
        title: initialData ? "Parceiro atualizado" : "Parceiro cadastrado",
        description: initialData
          ? "O parceiro foi atualizado com sucesso."
          : "O parceiro foi cadastrado com sucesso.",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar parceiro:", error);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao salvar o parceiro. Tente novamente mais tarde.",
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
            Preencha os dados do parceiro abaixo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="company_name"
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
              name="commission_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa de Comissão (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Taxa de comissão" 
                      {...field} 
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </FormControl>
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

const Partners = () => {
  const [partners, setPartners] = useState(mockPartners);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [isEditPartnerOpen, setIsEditPartnerOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const { toast } = useToast();

  const filteredPartners = partners.filter((partner) =>
    partner.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPartnerClients = (partnerId) => {
    return mockClients.filter((client) => client.partner_id === partnerId);
  };

  const getPartnerCommissions = (partnerId) => {
    return mockCommissions.filter((commission) => commission.partner_id === partnerId);
  };

  const calculateTotalRevenue = (partnerId) => {
    const clients = getPartnerClients(partnerId);
    return clients.reduce((total, client) => total + client.revenue, 0);
  };

  const calculatePendingCommission = (partnerId) => {
    const commissions = getPartnerCommissions(partnerId);
    return commissions
      .filter((commission) => !commission.is_paid)
      .reduce((total, commission) => total + commission.amount, 0);
  };

  const calculatePaidCommission = (partnerId) => {
    const commissions = getPartnerCommissions(partnerId);
    return commissions
      .filter((commission) => commission.is_paid)
      .reduce((total, commission) => total + commission.amount, 0);
  };

  const handleAddPartner = (data) => {
    const newPartner = {
      id: `${partners.length + 1}`,
      ...data,
      total_commission: 0,
    };
    setPartners([...partners, newPartner]);
  };

  const handleEditPartner = (data) => {
    const updatedPartners = partners.map((partner) =>
      partner.id === selectedPartner.id ? { ...partner, ...data } : partner
    );
    setPartners(updatedPartners);
  };

  const handleDeletePartner = (partnerId) => {
    const updatedPartners = partners.filter((partner) => partner.id !== partnerId);
    setPartners(updatedPartners);
    toast({
      title: "Parceiro removido",
      description: "O parceiro foi removido com sucesso.",
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Parceiros</h1>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar parceiros..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddPartnerOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Novo Parceiro
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg">Lista de Parceiros</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <Collapsible
                    key={partner.id}
                    open={expandedPartner === partner.id}
                    onOpenChange={() =>
                      setExpandedPartner(
                        expandedPartner === partner.id ? null : partner.id
                      )
                    }
                    className="border-b last:border-b-0"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div className="font-medium">{partner.company_name}</div>
                        <div className="text-sm text-muted-foreground">
                          Taxa: {partner.commission_rate}%
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4 text-sm">
                          <div className="flex flex-col items-end">
                            <span className="font-medium text-muted-foreground">Comissão Total</span>
                            <span className="font-semibold">
                              R$ {partner.total_commission.toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-medium text-muted-foreground">Clientes</span>
                            <span className="font-semibold">
                              {getPartnerClients(partner.id).length}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPartner(partner);
                              setIsEditPartnerOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePartner(partner.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon">
                              {expandedPartner === partner.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-4 pb-4">
                        <Tabs defaultValue="clients">
                          <TabsList className="mb-4">
                            <TabsTrigger value="clients">
                              <Users className="h-4 w-4 mr-2" />
                              Clientes
                            </TabsTrigger>
                            <TabsTrigger value="commissions">
                              <Wallet className="h-4 w-4 mr-2" />
                              Comissões
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="clients">
                            <div className="rounded-md border overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Nome da Empresa</TableHead>
                                    <TableHead>CNPJ/CPF</TableHead>
                                    <TableHead className="text-right">Faturamento</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {getPartnerClients(partner.id).length > 0 ? (
                                    getPartnerClients(partner.id).map((client) => (
                                      <TableRow key={client.id}>
                                        <TableCell>{client.business_name}</TableCell>
                                        <TableCell>{client.document}</TableCell>
                                        <TableCell className="text-right">
                                          R$ {client.revenue.toFixed(2).replace(".", ",")}
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={3} className="text-center h-24">
                                        Este parceiro não possui clientes.
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                            {getPartnerClients(partner.id).length > 0 && (
                              <div className="mt-4 flex justify-end">
                                <div className="bg-muted p-2 rounded-md text-sm">
                                  <span className="font-medium">Faturamento Total:</span>{" "}
                                  <span className="font-semibold">
                                    R$ {calculateTotalRevenue(partner.id).toFixed(2).replace(".", ",")}
                                  </span>
                                </div>
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="commissions">
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="bg-primary/10 p-4 rounded-lg flex-1 min-w-[200px]">
                                <div className="text-sm font-medium text-muted-foreground">
                                  Comissão Pendente
                                </div>
                                <div className="text-2xl font-bold mt-1">
                                  R$ {calculatePendingCommission(partner.id).toFixed(2).replace(".", ",")}
                                </div>
                              </div>
                              <div className="bg-primary/10 p-4 rounded-lg flex-1 min-w-[200px]">
                                <div className="text-sm font-medium text-muted-foreground">
                                  Comissão Paga
                                </div>
                                <div className="text-2xl font-bold mt-1">
                                  R$ {calculatePaidCommission(partner.id).toFixed(2).replace(".", ",")}
                                </div>
                              </div>
                              <div className="bg-primary/10 p-4 rounded-lg flex-1 min-w-[200px]">
                                <div className="text-sm font-medium text-muted-foreground">
                                  Taxa de Comissão
                                </div>
                                <div className="text-2xl font-bold mt-1">
                                  {partner.commission_rate}%
                                </div>
                              </div>
                            </div>

                            <div className="mb-4 flex items-center justify-between">
                              <div className="font-medium">Histórico de Comissões</div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant={dateFilter === "all" ? "secondary" : "outline"} 
                                  size="sm"
                                  onClick={() => setDateFilter("all")}
                                >
                                  Todas
                                </Button>
                                <Button 
                                  variant={dateFilter === "pending" ? "secondary" : "outline"} 
                                  size="sm"
                                  onClick={() => setDateFilter("pending")}
                                >
                                  Pendentes
                                </Button>
                                <Button 
                                  variant={dateFilter === "paid" ? "secondary" : "outline"} 
                                  size="sm"
                                  onClick={() => setDateFilter("paid")}
                                >
                                  Pagas
                                </Button>
                              </div>
                            </div>

                            <div className="rounded-md border overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Data de Pagamento</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {getPartnerCommissions(partner.id)
                                    .filter(commission => {
                                      if (dateFilter === "pending") return !commission.is_paid;
                                      if (dateFilter === "paid") return commission.is_paid;
                                      return true;
                                    })
                                    .map((commission) => (
                                      <TableRow key={commission.id}>
                                        <TableCell>
                                          R$ {commission.amount.toFixed(2).replace(".", ",")}
                                        </TableCell>
                                        <TableCell>
                                          {commission.paid_at || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <Badge variant={commission.is_paid ? "default" : "outline"}>
                                            {commission.is_paid ? "Pago" : "Pendente"}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              ) : (
                <div className="flex items-center justify-center h-24">
                  Nenhum parceiro encontrado.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isAddPartnerOpen && (
        <PartnerForm
          isOpen={isAddPartnerOpen}
          onClose={() => setIsAddPartnerOpen(false)}
          onSubmit={handleAddPartner}
        />
      )}

      {isEditPartnerOpen && selectedPartner && (
        <PartnerForm
          isOpen={isEditPartnerOpen}
          onClose={() => setIsEditPartnerOpen(false)}
          onSubmit={handleEditPartner}
          initialData={selectedPartner}
          title="Editar Parceiro"
        />
      )}
    </MainLayout>
  );
};

export default Partners;
