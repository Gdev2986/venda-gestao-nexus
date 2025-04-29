
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

// Import the new component field groups
import BusinessInfoFields, { businessInfoSchema } from "./BusinessInfoFields";
import ContactFields, { contactSchema } from "./ContactFields";
import AddressFields, { addressSchema } from "./AddressFields";

// Combine the schemas from the field groups
const formSchema = z.object({
  ...businessInfoSchema.shape,
  ...contactSchema.shape,
  ...addressSchema.shape,
});

type ClientFormValues = z.infer<typeof formSchema>;

export interface ClientFormProps {
  id?: string;
  initialData?: {
    id?: string;
    business_name: string;
    contact_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    partner_id?: string;
    document?: string;
  };
  onSubmit: (data: ClientFormValues) => void;
  partners?: { id: string; business_name: string }[];
  isOpen: boolean;
  onClose: () => void;
  submitButtonText?: string;
}

export function ClientForm({
  id,
  isOpen = true,
  onClose = () => {},
  onSubmit,
  initialData = {
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    partner_id: "",
    document: ""
  },
  partners = [],
  submitButtonText = "Salvar"
}: ClientFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: Partial<ClientFormValues> = {
    business_name: initialData?.business_name || "",
    contact_name: initialData?.contact_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip: initialData?.zip || "",
    partner_id: initialData?.partner_id || "",
    document: initialData?.document || "",
  };

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: ClientFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form id={id} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BusinessInfoFields form={form} partners={partners} />
        <ContactFields form={form} />
        <AddressFields form={form} />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
