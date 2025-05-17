
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
import { Separator } from "@/components/ui/separator";
import { MaskedInput } from "@/components/ui/masked-input";
import { useIBGELocations } from "@/hooks/use-ibge-locations";
import { usePartnersSelect } from "@/hooks/use-partners-select";
import { useAvailableMachines } from "@/hooks/use-available-machines";

// Formschema
const formSchema = z.object({
  business_name: z.string().min(2, { message: "Nome da empresa é obrigatório" }),
  document: z.string().min(14, { message: "CNPJ inválido" }),
  contact_name: z.string().min(2, { message: "Nome do contato é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  address: z.string().min(5, { message: "Endereço é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  zip: z.string().min(8, { message: "CEP inválido" }),
  balance: z.number().default(0),
  partner_id: z.string().optional(),
  machines: z.array(z.string()).optional(),
});

export type ClientFormValues = z.infer<typeof formSchema>;

export interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormValues) => Promise<boolean>;
  isSubmitting?: boolean;
  initialData?: ClientFormValues;
  title?: string;
  submitButtonText?: string;
}

const ClientForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  submitButtonText = "Salvar",
}: ClientFormProps) => {
  const { states, cities, selectedState, setSelectedState, isLoadingStates, isLoadingCities } = useIBGELocations();
  const { partners, isLoading: isLoadingPartners } = usePartnersSelect();
  const { machines, isLoading: isLoadingMachines } = useAvailableMachines();
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: initialData?.business_name || "",
      document: initialData?.document || "",
      contact_name: initialData?.contact_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zip: initialData?.zip || "",
      balance: initialData?.balance || 0,
      partner_id: initialData?.partner_id || undefined,
      machines: initialData?.machines || [],
    },
  });

  // Update cities when state changes
  useEffect(() => {
    const stateValue = form.watch("state");
    if (stateValue && stateValue !== selectedState) {
      setSelectedState(stateValue);
    }
  }, [form.watch("state"), selectedState, setSelectedState]);

  // Handle form submission
  const handleSubmit = async (values: ClientFormValues) => {
    // Include selected machines
    values.machines = selectedMachines;
    
    // Format numeric values
    if (typeof values.balance === "string") {
      values.balance = parseFloat(values.balance.replace(/[^\d.,]/g, "").replace(",", "."));
    }
    
    const success = await onSubmit(values);
    if (success) {
      form.reset();
    }
  };

  // Handle machine selection
  const toggleMachineSelection = (machineId: string) => {
    setSelectedMachines(prev => 
      prev.includes(machineId) 
        ? prev.filter(id => id !== machineId) 
        : [...prev, machineId]
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações da Empresa</h3>
            <Separator />
            
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ*</FormLabel>
                  <FormControl>
                    <MaskedInput 
                      mask="00.000.000/0000-00" 
                      placeholder="00.000.000/0000-00"
                      onChange={(value) => field.onChange(value)} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                    disabled={isLoadingPartners}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um parceiro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Inicial</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        R$
                      </span>
                      <Input
                        type="text"
                        className="pl-8"
                        placeholder="0,00"
                        value={field.value === 0 ? "0,00" : field.value.toString().replace(".", ",")}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d,]/g, "");
                          field.onChange(parseFloat(value.replace(",", ".") || "0"));
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações de Contato</h3>
            <Separator />
            
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Contato*</FormLabel>
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
                  <FormLabel>Email*</FormLabel>
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
                  <FormLabel>Telefone*</FormLabel>
                  <FormControl>
                    <MaskedInput 
                      mask="(00) 00000-0000" 
                      placeholder="(00) 00000-0000"
                      onChange={(value) => field.onChange(value)} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endereço</h3>
            <Separator />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço Completo*</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP*</FormLabel>
                  <FormControl>
                    <MaskedInput 
                      mask="00000-000" 
                      placeholder="00000-000"
                      onChange={(value) => field.onChange(value)} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado*</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedState(value);
                        form.setValue("city", "");
                      }}
                      value={field.value}
                      disabled={isLoadingStates}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={state.sigla}>
                            {state.sigla} - {state.nome}
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingCities || !selectedState}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a cidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.nome}>
                            {city.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Machines Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Máquinas</h3>
            <Separator />
            
            <div className="h-[200px] overflow-y-auto border rounded-md p-2">
              {isLoadingMachines ? (
                <div className="flex items-center justify-center h-full">
                  <p>Carregando máquinas...</p>
                </div>
              ) : machines.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p>Nenhuma máquina disponível</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {machines.map((machine) => (
                    <div key={machine.id} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`machine-${machine.id}`}
                        checked={selectedMachines.includes(machine.id)}
                        onChange={() => toggleMachineSelection(machine.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor={`machine-${machine.id}`} className="text-sm">
                        {machine.serial_number} - {machine.model}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" disabled={isSubmitting} onClick={() => form.reset()}>
            Limpar
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
