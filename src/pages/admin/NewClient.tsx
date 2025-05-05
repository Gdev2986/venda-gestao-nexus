
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { usePartners } from "@/hooks/use-partners";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Mock fee plans until we have a real API
const mockFeePlans = [
  { id: "1", name: "Básico" },
  { id: "2", name: "Intermediário" },
  { id: "3", name: "Premium" },
];

// Form schema
const formSchema = z.object({
  business_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  document: z.string().optional(),
  partner_id: z.string().optional(),
  fee_plan_id: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addClient, loading } = useClients();
  const { partners, loading: partnersLoading, refreshPartners } = usePartners();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: "",
      email: "",
      phone: "",
      document: "",
      partner_id: "",
      fee_plan_id: "1", // Default to basic plan
      address: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await addClient(data);
      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso.",
      });
      navigate(PATHS.ADMIN.CLIENTS);
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: "Erro ao criar cliente",
        description: "Não foi possível criar o cliente. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Cliente</h1>
          <p className="text-muted-foreground">
            Adicione um novo cliente ao sistema
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(PATHS.ADMIN.CLIENTS)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
          <CardDescription>Preencha os dados para cadastrar um novo cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados Principais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome/Razão Social*</label>
                    <Input
                      {...form.register("business_name")}
                      placeholder="Nome do cliente ou empresa"
                    />
                    {form.formState.errors.business_name && (
                      <p className="text-sm text-red-500">{form.formState.errors.business_name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-mail*</label>
                    <Input
                      {...form.register("email")}
                      type="email"
                      placeholder="email@exemplo.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      {...form.register("phone")}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF/CNPJ</label>
                    <Input
                      {...form.register("document")}
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Endereço</label>
                      <Input
                        {...form.register("address")}
                        placeholder="Rua, número, complemento"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cidade</label>
                      <Input
                        {...form.register("city")}
                        placeholder="Cidade"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Estado</label>
                      <Input
                        {...form.register("state")}
                        placeholder="Estado"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CEP</label>
                      <Input
                        {...form.register("zip")}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Configurações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Parceiro</label>
                      <Select
                        onValueChange={(value) => form.setValue("partner_id", value)}
                        defaultValue={form.getValues("partner_id")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um parceiro (opcional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Nenhum parceiro</SelectItem>
                          {partners.map((partner) => (
                            <SelectItem key={partner.id} value={partner.id}>
                              {partner.company_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Plano de Taxas</label>
                      <Select
                        onValueChange={(value) => form.setValue("fee_plan_id", value)}
                        defaultValue={form.getValues("fee_plan_id")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um plano de taxas" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockFeePlans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(PATHS.ADMIN.CLIENTS)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Criar Cliente"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewClient;
