
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Partner } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFeePlans } from "@/hooks/use-fee-plans";
import { Loader2 } from "lucide-react";

// Define form schema
const formSchema = z.object({
  company_name: z.string().min(2, {
    message: "O nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  business_name: z.string().min(2, {
    message: "O nome fantasia deve ter pelo menos 2 caracteres.",
  }).optional(),
  contact_name: z.string().min(2, {
    message: "O nome do contato deve ter pelo menos 2 caracteres.",
  }).optional(),
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }).optional(),
  phone: z.string().min(10, {
    message: "O telefone deve ter pelo menos 10 caracteres.",
  }).optional(),
  fee_plan_id: z.string().optional(),
});

export type PartnerFormValues = z.infer<typeof formSchema>;

export interface PartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PartnerFormValues) => void | Promise<boolean>;
  initialData?: {
    id?: string;
    company_name: string;
    business_name?: string;
    contact_name?: string;
    email?: string;
    phone?: string;
    fee_plan_id?: string;
  };
  title?: string;
  isSubmitting?: boolean;
}

const PartnerForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "Novo Parceiro",
  isSubmitting = false,
}: PartnerFormProps) => {
  const { feePlans, isLoading: isLoadingFeePlans } = useFeePlans();
  
  const defaultValues: Partial<PartnerFormValues> = {
    company_name: initialData?.company_name || "",
    business_name: initialData?.business_name || "",
    contact_name: initialData?.contact_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    fee_plan_id: initialData?.fee_plan_id || "",
  };

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: PartnerFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Fantasia</FormLabel>
              <FormControl>
                <Input placeholder="Nome fantasia" {...field} />
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
                <Input placeholder="Nome completo do contato" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemplo.com" {...field} />
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
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  {isLoadingFeePlans ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Carregando planos...</span>
                    </div>
                  ) : (
                    <>
                      <SelectItem value="">Plano Padrão</SelectItem>
                      {feePlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                O plano de taxas determinará as comissões aplicadas aos clientes deste parceiro.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PartnerForm;
