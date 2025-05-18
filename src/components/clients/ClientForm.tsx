
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { clientFormSchema, ClientFormValues } from './schema/clientFormSchema';
import BusinessInfoFields from './BusinessInfoFields';
import ContactInfoFields from './ContactInfoFields';
import AddressFields from './AddressFields';
import { useMachines } from '@/hooks/use-machines';
import { MultiSelect } from '@/components/ui/multi-select';

interface ClientFormProps {
  onSubmit: (data: ClientFormValues) => Promise<boolean>;
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  initialData?: ClientFormValues;
  submitButtonText?: string;
}

const ClientForm = ({
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  initialData,
  submitButtonText = "Salvar",
}: ClientFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { machines, isLoading: isLoadingMachines } = useMachines();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData || {
      business_name: "",
      document: "",
      contact_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      balance: 0,
      partner_id: "",
      machines: [],
    }
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset(initialData || {
        business_name: "",
        document: "",
        contact_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        balance: 0,
        partner_id: "",
        machines: [],
      });
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = async (data: ClientFormValues) => {
    setSubmitError(null);
    try {
      const result = await onSubmit(data);
      if (result) {
        form.reset();
        onClose();
      }
    } catch (error: any) {
      setSubmitError(error.message || "Erro ao salvar cliente");
    }
  };

  // Transform machines array to options for MultiSelect
  const machineOptions = machines ? machines.map(machine => ({
    label: `${machine.model} - ${machine.serial_number}`,
    value: machine.id
  })) : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Informações da Empresa</h3>
              <div className="space-y-4">
                <BusinessInfoFields form={form} />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Informações de Contato</h3>
              <div className="space-y-4">
                <ContactInfoFields form={form} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Endereço</h3>
              <div className="space-y-4">
                <AddressFields form={form} />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Máquinas</h3>
              <FormField
                control={form.control}
                name="machines"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecione as máquinas para este cliente</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={machineOptions}
                        placeholder="Selecione as máquinas..."
                        isLoading={isLoadingMachines}
                        value={field.value?.map(id => 
                          machineOptions.find(option => option.value === id) || { label: id, value: id }
                        ) || []}
                        onChange={selected => field.onChange(selected.map(item => item.value))}
                        emptyMessage={isLoadingMachines ? "Carregando máquinas..." : "Não há máquinas disponíveis para associação"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        {/* Display any submission errors */}
        {submitError && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            {submitError}
          </div>
        )}
        
        {/* Form buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
export type { ClientFormValues };
