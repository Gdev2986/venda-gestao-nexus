
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { usePartners } from "@/hooks/use-partners";
import { clientFormSchema } from "./schema/clientFormSchema";
import AddressFields from "./AddressFields";
import BusinessInfoFields from "./BusinessInfoFields";
import ContactFields from "./ContactFields";
import MachineSelectionField from "./MachineSelectionField";

export type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormValues) => Promise<boolean>;
  isSubmitting: boolean;
  initialData?: ClientFormValues;
  submitButtonText?: string;
}

const ClientForm = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  submitButtonText = "Salvar",
}: ClientFormProps) => {
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const { partners, isLoading: isLoadingPartners } = usePartners();

  const isEditing = !!initialData;

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
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
      balance: 0,
      machines: [],
    },
  });

  // Reset form when initialData changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset(initialData);
        setSelectedMachines(initialData.machines || []);
      } else {
        form.reset({
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
          balance: 0,
          machines: [],
        });
        setSelectedMachines([]);
      }
    }
  }, [initialData, isOpen, form]);

  // Update form value when selected machines change
  useEffect(() => {
    form.setValue("machines", selectedMachines);
  }, [selectedMachines, form]);

  const handleSubmit = async (data: ClientFormValues) => {
    const success = await onSubmit(data);
    if (success && !initialData) {
      form.reset();
      setSelectedMachines([]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs defaultValue="business" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="business">Empresa</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="space-y-4">
            <BusinessInfoFields form={form} isEditing={isEditing} />
            
            <FormField
              control={form.control}
              name="partner_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parceiro</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoadingPartners}
                      {...field}
                    >
                      <option value="">Selecionar parceiro</option>
                      {partners?.map((partner) => (
                        <option key={partner.id} value={partner.id}>
                          {partner.company_name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Inicial</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      disabled={isEditing}
                      className={isEditing ? "bg-muted cursor-not-allowed" : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditing 
                      ? "O saldo inicial não pode ser alterado para clientes existentes."
                      : "Saldo inicial em reais"
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <ContactFields form={form} />
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <AddressFields form={form} />
          </TabsContent>
        </Tabs>

        <MachineSelectionField
          selectedMachines={selectedMachines}
          setSelectedMachines={setSelectedMachines}
        />

        <div className="flex gap-2 justify-end mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
