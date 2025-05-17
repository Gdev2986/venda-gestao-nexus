import { useState, useEffect } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MaskedInput } from "@/components/ui/masked-input";
import { FormMaskedInput } from "./FormMaskedInput";
import { usePartnersSelect } from "@/hooks/use-partners-select";
import { useAvailableMachines } from "@/hooks/use-available-machines";
import { useCepLookup } from "@/hooks/use-cep-lookup";
import { Loader2 } from "lucide-react";
import { useClientRealtime } from "@/hooks/useClientRealtime";

// Define the form schema with validations
const formSchema = z.object({
  business_name: z.string().min(2, { message: "Nome da empresa obrigatório" }),
  document: z.string().min(14, { message: "CNPJ obrigatório" }),
  contact_name: z.string().min(2, { message: "Nome do contato obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(11, { message: "Telefone obrigatório" }),
  address: z.string().min(5, { message: "Endereço obrigatório" }),
  city: z.string().min(2, { message: "Cidade obrigatória" }),
  state: z.string().min(2, { message: "Estado obrigatório" }),
  zip: z.string().min(8, { message: "CEP obrigatório" }),
  balance: z.number().optional().default(0),
  partner_id: z.string().optional(),
  machines: z.array(z.string()).optional(),
});

// Define the form values type
export type ClientFormValues = z.infer<typeof formSchema>;

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
  const { partners, isLoading: isLoadingPartners } = usePartnersSelect();
  const { machines, isLoading: isLoadingMachines } = useAvailableMachines();
  const { lookupCep, isLoading: isLoadingCep, error: cepError } = useCepLookup();
  
  const [cepEditable, setCepEditable] = useState(false);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  // Initialize form
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      partner_id: undefined,
      machines: [],
      ...initialData,
    },
  });

  // Setup realtime refresh
  useClientRealtime(() => {
    if (!isOpen) {
      // Refresh data when modal is not open to prevent refreshing during form submission
      console.log("Realtime update received");
    }
  });

  // Handle form submission
  const handleSubmit = async (data: ClientFormValues) => {
    const result = await onSubmit({
      ...data,
      machines: selectedMachines,
      balance: data.balance || 0,
    });
    if (result) {
      form.reset();
      setSelectedMachines([]);
    }
  };

  // Handle CEP lookup
  const handleCepChange = async (value: string) => {
    if (value.replace(/\D/g, "").length === 8) {
      const address = await lookupCep(value);
      if (address) {
        form.setValue("state", address.state);
        form.setValue("city", address.city);
        setCepEditable(false);
      } else {
        setCepEditable(true);
      }
    }
  };

  // Handle machine selection
  const handleMachineSelection = (machineId: string) => {
    setSelectedMachines((prev) => {
      if (prev.includes(machineId)) {
        return prev.filter((id) => id !== machineId);
      } else {
        return [...prev, machineId];
      }
    });
  };

  // Keep selectedMachines in sync with form value
  useEffect(() => {
    if (form.getValues().machines?.length) {
      setSelectedMachines(form.getValues().machines || []);
    }
  }, [isOpen]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Business info and address */}
          <div className="space-y-4">
            <h3 className="text-md font-medium">Informações da Empresa</h3>
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa<span className="text-destructive"> *</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormMaskedInput
              control={form.control}
              name="document"
              label="CNPJ"
              mask="00.000.000/0000-00"
              placeholder="00.000.000/0000-00"
              required
            />
            
            <FormField
              control={form.control}
              name="partner_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parceiro</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um parceiro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingPartners ? (
                        <div className="flex justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        partners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                            {partner.company_name}
                          </SelectItem>
                        ))
                      )}
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
                      type="number" 
                      step="0.01"
                      placeholder="0,00" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : 0;
                        field.onChange(value);
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <h3 className="text-md font-medium mt-6">Endereço</h3>
            
            <FormMaskedInput
              control={form.control}
              name="zip"
              label="CEP"
              mask="00000-000"
              placeholder="00000-000"
              required
            />
            
            <div className="flex gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado<span className="text-destructive"> *</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="UF" 
                          {...field} 
                          maxLength={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade<span className="text-destructive"> *</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Cidade" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço Completo<span className="text-destructive"> *</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Endereço completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Right column: Contact info and machines */}
          <div className="space-y-4">
            <h3 className="text-md font-medium">Informações de Contato</h3>
            
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Contato<span className="text-destructive"> *</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email<span className="text-destructive"> *</span></FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormMaskedInput
              control={form.control}
              name="phone"
              label="Telefone"
              mask="(00) 00000-0000"
              placeholder="(00) 00000-0000"
              required
            />
            
            <h3 className="text-md font-medium mt-6">Máquinas</h3>
            
            <div className="border rounded p-3 space-y-2">
              <p className="text-sm text-gray-500">Selecione as máquinas para este cliente:</p>
              {isLoadingMachines ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : machines.length === 0 ? (
                <p className="text-sm text-center py-4 text-muted-foreground">
                  Não há máquinas disponíveis para associação.
                </p>
              ) : (
                <div className="h-[200px] overflow-y-auto space-y-2">
                  {machines.map((machine) => (
                    <div key={machine.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded">
                      <input
                        type="checkbox"
                        id={`machine-${machine.id}`}
                        checked={selectedMachines.includes(machine.id)}
                        onChange={() => handleMachineSelection(machine.id)}
                        className="h-4 w-4 rounded"
                      />
                      <label htmlFor={`machine-${machine.id}`} className="flex-1 text-sm cursor-pointer">
                        {machine.serial_number} ({machine.model})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
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
