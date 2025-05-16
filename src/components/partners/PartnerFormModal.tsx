
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Partner } from "@/types";

// Form schema
const formSchema = z.object({
  company_name: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  contact_name: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().optional(),
  commission_rate: z.coerce.number().min(0).max(100).optional(),
});

export type PartnerFormValues = z.infer<typeof formSchema>;

interface PartnerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PartnerFormValues) => Promise<boolean>;
  isSubmitting: boolean;
  defaultValues?: Partner;
  mode?: "create" | "edit";
}

export function PartnerFormModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  defaultValues,
  mode = "create",
}: PartnerFormModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? {
          company_name: defaultValues.company_name || "",
          contact_name: defaultValues.contact_name || "",
          email: defaultValues.email || "",
          phone: defaultValues.phone || "",
          commission_rate: defaultValues.commission_rate || 0,
        }
      : {
          company_name: "",
          contact_name: "",
          email: "",
          phone: "",
          commission_rate: 0,
        },
  });

  const handleSubmit = async (data: PartnerFormValues) => {
    setSubmitError(null);
    try {
      const result = await onSubmit(data);
      if (result) {
        form.reset();
      }
    } catch (error: any) {
      setSubmitError(error.message || "Erro ao salvar parceiro");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Adicionar Parceiro" : "Editar Parceiro"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
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
                      <Input placeholder="Telefone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                {submitError}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Salvando..."
                  : mode === "create"
                  ? "Adicionar"
                  : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
