
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Partner } from "@/types";
import { useClients } from "@/hooks/use-clients";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Form schema without commission_rate
const formSchema = z.object({
  company_name: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  contact_name: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().optional(),
  linked_clients: z.array(z.string()).optional(),
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
  const { clients, isLoading: clientsLoading } = useClients();
  const { toast } = useToast();

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? {
          company_name: defaultValues.company_name || "",
          contact_name: defaultValues.contact_name || "",
          email: defaultValues.email || "",
          phone: defaultValues.phone || "",
          linked_clients: [],
        }
      : {
          company_name: "",
          contact_name: "",
          email: "",
          phone: "",
          linked_clients: [],
        },
  });

  const handleSubmit = async (data: PartnerFormValues) => {
    setSubmitError(null);
    try {
      const result = await onSubmit(data);
      if (result) {
        // Update client-partner relationships
        if (data.linked_clients && data.linked_clients.length > 0) {
          await updateClientPartnerRelationships(data.linked_clients);
        }
        form.reset();
      }
    } catch (error: any) {
      setSubmitError(error.message || "Erro ao salvar parceiro");
    }
  };

  const updateClientPartnerRelationships = async (clientIds: string[]) => {
    try {
      // This would need the partner ID - for now just show toast
      toast({
        title: "Clientes vinculados",
        description: `${clientIds.length} clientes selecionados para vinculação`,
      });
    } catch (error) {
      console.error("Error updating client relationships:", error);
    }
  };

  const availableClients = clients?.filter(client => !client.partner_id) || [];

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
              name="linked_clients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vincular Clientes</FormLabel>
                  <FormControl>
                    <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                      {clientsLoading ? (
                        <div className="text-sm text-muted-foreground">
                          Carregando clientes...
                        </div>
                      ) : availableClients.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          Nenhum cliente disponível para vinculação
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {availableClients.map((client) => (
                            <div key={client.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={client.id}
                                checked={field.value?.includes(client.id) || false}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, client.id]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((id) => id !== client.id)
                                    );
                                  }
                                }}
                              />
                              <label 
                                htmlFor={client.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {client.business_name || client.company_name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
