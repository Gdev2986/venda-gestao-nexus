
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
  commission_rate: z.coerce.number().min(0).max(100).optional(),
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
    commission_rate?: number;
  };
  title?: string;
  isSubmitting?: boolean;
  hideCommissionRate?: boolean;
}

const PartnerForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "Novo Parceiro",
  isSubmitting = false,
  hideCommissionRate = false,
}: PartnerFormProps) => {
  const defaultValues: Partial<PartnerFormValues> = {
    company_name: initialData?.company_name || "",
    business_name: initialData?.business_name || "",
    contact_name: initialData?.contact_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    commission_rate: initialData?.commission_rate || 0,
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

        {!hideCommissionRate && (
          <FormField
            control={form.control}
            name="commission_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa de Comissão (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0.0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Porcentagem de comissão sobre as vendas (0-100%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
