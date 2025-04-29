
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FileText,
  Search,
  Plus,
  Upload,
  Check,
  X,
  CreditCard,
  QrCode,
  Filter,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data
const mockPaymentRequests = [
  { 
    id: "1", 
    client_id: "1", 
    client_name: "Empresa A",
    amount: 1250.00, 
    status: "PENDING", 
    created_at: "2023-08-20", 
    pix_key_id: "1",
    pix_key: "email@example.com",
    pix_key_type: "EMAIL"
  },
  { 
    id: "2", 
    client_id: "2", 
    client_name: "Empresa B",
    amount: 2500.00, 
    status: "APPROVED", 
    created_at: "2023-08-15", 
    approved_at: "2023-08-16",
    pix_key_id: "2",
    pix_key: "12345678901",
    pix_key_type: "CPF"
  },
  { 
    id: "3", 
    client_id: "3", 
    client_name: "Empresa C",
    amount: 1800.00, 
    status: "REJECTED", 
    created_at: "2023-08-10",
    pix_key_id: "3",
    pix_key: "98765432109",
    pix_key_type: "CNPJ" 
  },
  { 
    id: "4", 
    client_id: "1", 
    client_name: "Empresa A",
    amount: 950.00, 
    status: "APPROVED", 
    created_at: "2023-07-28", 
    approved_at: "2023-07-29",
    pix_key_id: "1",
    pix_key: "email@example.com",
    pix_key_type: "EMAIL"
  },
];

const mockPixKeys = [
  { id: "1", user_id: "user1", type: "EMAIL", key: "email@example.com", name: "Email Principal", is_default: true },
  { id: "2", user_id: "user1", type: "CPF", key: "12345678901", name: "CPF Pessoal", is_default: false },
  { id: "3", user_id: "user2", type: "CNPJ", key: "98765432109", name: "CNPJ Empresa", is_default: true },
  { id: "4", user_id: "user3", type: "PHONE", key: "+5511999999999", name: "Celular", is_default: true },
];

// Define form schemas
const paymentRequestSchema = z.object({
  amount: z.coerce.number().min(1, { message: "O valor deve ser maior que zero" }),
  pix_key_id: z.string().optional(),
  new_pix_key: z.string().optional(),
  new_pix_key_type: z.enum(["CPF", "CNPJ", "EMAIL", "PHONE", "RANDOM"]).optional(),
  new_pix_key_name: z.string().optional(),
  save_pix_key: z.boolean().default(false),
});

const boletoUploadSchema = z.object({
  amount: z.coerce.number().min(1, { message: "O valor deve ser maior que zero" }),
  file: z.instanceof(FileList).refine(files => files.length > 0, {
    message: "O boleto é obrigatório",
  }),
});

type PaymentRequestFormValues = z.infer<typeof paymentRequestSchema>;
type BoletoUploadFormValues = z.infer<typeof boletoUploadSchema>;

const PaymentRequestForm = ({ isOpen, onClose, onSubmit, pixKeys = [] }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [useNewPixKey, setUseNewPixKey] = useState(false);

  const form = useForm<PaymentRequestFormValues>({
    resolver: zodResolver(paymentRequestSchema),
    defaultValues: {
      amount: 0,
      save_pix_key: false,
    },
  });

  const handleSubmit = async (data: PaymentRequestFormValues) => {
    try {
      setIsLoading(true);
      onSubmit(data);
      toast({
        title: "Pagamento solicitado",
        description: "A solicitação de pagamento foi enviada com sucesso.",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao solicitar pagamento:", error);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao solicitar o pagamento. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pixKeyRequired = useNewPixKey
    ? z.string().min(1, { message: "Chave PIX obrigatória" })
    : z.string().optional();

  const pixKeyTypeRequired = useNewPixKey
    ? z.string().min(1, { message: "Tipo de chave PIX obrigatória" })
    : z.string().optional();

  const pixKeyNameRequired = useNewPixKey
    ? z.string().min(1, { message: "Nome da chave PIX obrigatória" })
    : z.string().optional();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicitar Pagamento via PIX</DialogTitle>
          <DialogDescription>
            Preencha os dados para solicitar um pagamento via PIX
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0,00"
                      {...field}
                      step="0.01"
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Chave PIX</div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUseNewPixKey(!useNewPixKey)}
              >
                {useNewPixKey ? "Usar chave existente" : "Nova chave PIX"}
              </Button>
            </div>

            {!useNewPixKey ? (
              <FormField
                control={form.control}
                name="pix_key_id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma chave PIX" />
                        </SelectTrigger>
                        <SelectContent>
                          {pixKeys.map((pixKey) => (
                            <SelectItem key={pixKey.id} value={pixKey.id}>
                              {pixKey.name} ({pixKey.key})
                              {pixKey.is_default && " - Padrão"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="new_pix_key_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Chave</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de chave" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CPF">CPF</SelectItem>
                          <SelectItem value="CNPJ">CNPJ</SelectItem>
                          <SelectItem value="EMAIL">Email</SelectItem>
                          <SelectItem value="PHONE">Telefone</SelectItem>
                          <SelectItem value="RANDOM">Chave Aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_pix_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave PIX</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite sua chave PIX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_pix_key_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Chave</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome para identificação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="save_pix_key"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Salvar esta chave PIX</FormLabel>
                        <FormDescription>
                          Salvar para uso futuro
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}

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
                {isLoading ? "Enviando..." : "Solicitar Pagamento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const BoletoUploadForm = ({ isOpen, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const form = useForm<BoletoUploadFormValues>({
    resolver: zodResolver(boletoUploadSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setFileName(files[0].name);
      form.setValue("file", files);
    }
  };

  const handleSubmit = async (data: BoletoUploadFormValues) => {
    try {
      setIsLoading(true);
      onSubmit(data);
      toast({
        title: "Boleto enviado",
        description: "O boleto foi enviado com sucesso para aprovação.",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao enviar boleto:", error);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao enviar o boleto. Tente novamente mais tarde.",
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
          <DialogTitle>Enviar Boleto para Pagamento</DialogTitle>
          <DialogDescription>
            Envie um boleto para aprovação do financeiro
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Boleto (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0,00"
                      {...field}
                      step="0.01"
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arquivo do Boleto</FormLabel>
                  <FormControl>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          handleFileChange(e);
                          field.onChange(e.target.files);
                        }}
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                      >
                        {fileName ? fileName : (
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span>Selecionar Arquivo</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Formatos aceitos: PDF, JPG, JPEG, PNG
                  </FormDescription>
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
                {isLoading ? "Enviando..." : "Enviar Boleto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const Payments = () => {
  const [paymentRequests, setPaymentRequests] = useState(mockPaymentRequests);
  const [pixKeys, setPixKeys] = useState(mockPixKeys);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isPaymentRequestOpen, setIsPaymentRequestOpen] = useState(false);
  const [isBoletoUploadOpen, setIsBoletoUploadOpen] = useState(false);
  const { toast } = useToast();

  const filteredPaymentRequests = paymentRequests.filter((request) => {
    const matchesSearch =
      request.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.amount.toString().includes(searchQuery);
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && request.status === "PENDING";
    if (activeTab === "approved") return matchesSearch && request.status === "APPROVED";
    if (activeTab === "rejected") return matchesSearch && request.status === "REJECTED";
    
    return matchesSearch;
  });

  const handlePaymentRequest = (data) => {
    const newPaymentRequest = {
      id: `${paymentRequests.length + 1}`,
      client_id: "1", // In a real app, this would be the current user's client ID
      client_name: "Empresa A", // In a real app, this would be the current user's business name
      amount: data.amount,
      status: "PENDING",
      created_at: new Date().toISOString().split('T')[0],
      pix_key_id: data.pix_key_id || "new",
      pix_key: data.new_pix_key || "email@example.com",
      pix_key_type: data.new_pix_key_type || "EMAIL",
    };
    
    setPaymentRequests([newPaymentRequest, ...paymentRequests]);
    
    // If the user chose to save a new PIX key
    if (data.save_pix_key && data.new_pix_key && data.new_pix_key_type && data.new_pix_key_name) {
      const newPixKey = {
        id: `${pixKeys.length + 1}`,
        user_id: "user1", // In a real app, this would be the current user's ID
        type: data.new_pix_key_type,
        key: data.new_pix_key,
        name: data.new_pix_key_name,
        is_default: pixKeys.length === 0, // Make it default if it's the first key
      };
      
      setPixKeys([...pixKeys, newPixKey]);
    }
  };

  const handleBoletoUpload = (data) => {
    // In a real app, you would upload the file to a server
    console.log("Boleto uploaded:", data.file[0].name);
    console.log("Amount:", data.amount);
    
    const newPaymentRequest = {
      id: `${paymentRequests.length + 1}`,
      client_id: "1", // In a real app, this would be the current user's client ID
      client_name: "Empresa A", // In a real app, this would be the current user's business name
      amount: data.amount,
      status: "PENDING",
      created_at: new Date().toISOString().split('T')[0],
      pix_key_id: null,
      pix_key: null,
      pix_key_type: null,
      is_boleto: true,
    };
    
    setPaymentRequests([newPaymentRequest, ...paymentRequests]);
  };

  const handleApproveRequest = (requestId) => {
    const updatedRequests = paymentRequests.map((request) =>
      request.id === requestId
        ? {
            ...request,
            status: "APPROVED",
            approved_at: new Date().toISOString().split('T')[0],
          }
        : request
    );
    
    setPaymentRequests(updatedRequests);
    toast({
      title: "Pagamento aprovado",
      description: "A solicitação de pagamento foi aprovada com sucesso.",
    });
  };

  const handleRejectRequest = (requestId) => {
    const updatedRequests = paymentRequests.map((request) =>
      request.id === requestId ? { ...request, status: "REJECTED" } : request
    );
    
    setPaymentRequests(updatedRequests);
    toast({
      title: "Pagamento rejeitado",
      description: "A solicitação de pagamento foi rejeitada.",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge variant="default" className="bg-green-500">
            Aprovado
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Rejeitado
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge variant="outline">
            Pendente
          </Badge>
        );
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pagamentos..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Solicitar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsPaymentRequestOpen(true)}>
                  <QrCode className="mr-2 h-4 w-4" />
                  <span>Via PIX</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsBoletoUploadOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Via Boleto</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Solicitações de Pagamento</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" /> Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab("all")}>
                    Todos os Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("pending")}>
                    Pendentes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("approved")}>
                    Aprovados
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("rejected")}>
                    Rejeitados
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="hidden md:table-cell">Data</TableHead>
                    <TableHead className="hidden md:table-cell">Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaymentRequests.length > 0 ? (
                    filteredPaymentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.client_name}</TableCell>
                        <TableCell>
                          R$ {request.amount.toFixed(2).replace(".", ",")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{request.created_at}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {request.is_boleto ? (
                            <div className="flex items-center">
                              <FileText className="mr-1 h-4 w-4" /> Boleto
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <QrCode className="mr-1 h-4 w-4" /> PIX
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {request.status === "PENDING" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleApproveRequest(request.id)}
                                >
                                  <Check className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRejectRequest(request.id)}
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                            {request.is_boleto && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  // In a real app, this would download the boleto
                                  toast({
                                    title: "Download iniciado",
                                    description: "O download do boleto foi iniciado.",
                                  });
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        Nenhuma solicitação de pagamento encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {isPaymentRequestOpen && (
        <PaymentRequestForm
          isOpen={isPaymentRequestOpen}
          onClose={() => setIsPaymentRequestOpen(false)}
          onSubmit={handlePaymentRequest}
          pixKeys={pixKeys}
        />
      )}

      {isBoletoUploadOpen && (
        <BoletoUploadForm
          isOpen={isBoletoUploadOpen}
          onClose={() => setIsBoletoUploadOpen(false)}
          onSubmit={handleBoletoUpload}
        />
      )}
    </MainLayout>
  );
};

export default Payments;
