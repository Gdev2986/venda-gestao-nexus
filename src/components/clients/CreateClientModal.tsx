import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const formSchema = z.object({
  business_name: z.string().min(2, "Nome da empresa é obrigatório"),
  contact_name: z.string().min(2, "Nome do contato é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  document: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  partner_id: z.string().optional(),
  fee_plan_id: z.string().optional(),
  status: z.string().optional(),
  balance: z.coerce.number().optional(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface CreateClientModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: Partial<Client>) => void;
  isInline?: boolean;
  initialData?: Client;
  partners: { id: string; company_name: string }[];
  feePlans: { id: string; name: string }[];
}

export const CreateClientModal = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  isInline = false,
  initialData,
  partners,
  feePlans
}: CreateClientModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
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
      fee_plan_id: "",
      status: "active",
      balance: 0,
      password: "",
    },
  });
  
  const handleSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    try {
      // Remove password if empty (for updates)
      if (!data.password) {
        delete data.password;
      }
      
      // Submit form data
      await onSubmit({
        ...initialData,
        ...data,
      });
      
      if (!isInline) {
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>
          
          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome da empresa" />
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
                  <FormLabel>Nome do Contato*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome do contato principal" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="email@exemplo.com" />
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
                    <FormLabel>Telefone*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="(00) 00000-0000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ/CPF</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="00.000.000/0000-00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!initialData && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Inicial*</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Senha inicial para acesso" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </TabsContent>
          
          {/* Address Information */}
          <TabsContent value="address" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Rua, número, complemento" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Cidade" />
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
                      <Input {...field} placeholder="Estado" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="00000-000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          {/* System Information */}
          <TabsContent value="system" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="partner_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parceiro Vinculado</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um parceiro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhum parceiro</SelectItem>
                      {partners.map((partner) => (
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
            
            <FormField
              control={form.control}
              name="fee_plan_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plano de Taxas</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano de taxas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="default">Plano padrão</SelectItem>
                      {feePlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value || "active"}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Inicial (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2">
          {!isInline && (
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : initialData ? "Atualizar Cliente" : "Criar Cliente"}
          </Button>
        </div>
      </form>
    </Form>
  );
  
  if (isInline) {
    return <FormContent />;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Cliente" : "Adicionar Novo Cliente"}</DialogTitle>
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientModal;
