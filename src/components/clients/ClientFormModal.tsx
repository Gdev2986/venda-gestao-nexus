
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ClientFormSchema, ClientFormValues } from "./form/ClientFormSchema";
import { ClientFormCompanyInfo } from "./form/ClientFormCompanyInfo";
import { ClientFormContactInfo } from "./form/ClientFormContactInfo";
import { ClientFormAddressInfo } from "./form/ClientFormAddressInfo";
import { ClientFormActions } from "./form/ClientFormActions";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: Client;
  onSubmit?: (data: any) => Promise<boolean>;
}

const ClientFormModal = ({
  isOpen,
  onClose,
  title,
  initialData,
  onSubmit,
}: ClientFormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      // Company information
      company_name: initialData?.company_name || "",
      cnpj: initialData?.cnpj || "",
      partner_id: initialData?.partner_id || "",
      initial_balance: initialData?.initial_balance || 0,
      
      // Contact information
      contact_name: initialData?.contact_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      
      // Address information
      address: initialData?.address || "",
      address_number: initialData?.address_number || "",
      neighborhood: initialData?.neighborhood || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zip_code: initialData?.zip_code || "",
    }
  });
  
  const handleSubmitForm = async (formData: ClientFormValues) => {
    setIsLoading(true);
    try {
      if (onSubmit) {
        const success = await onSubmit(formData);
        if (success) {
          onClose();
        }
      } else {
        // Default create logic
        // Map formData to match database schema
        const clientData = {
          business_name: formData.company_name,
          document: formData.cnpj,
          partner_id: formData.partner_id === "none" ? null : formData.partner_id || null,
          balance: formData.initial_balance || 0,
          contact_name: formData.contact_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip_code
        };
        
        const { data, error } = await supabase
          .from("clients")
          .insert(clientData)
          .select();
        
        if (error) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: `Erro ao criar cliente: ${error.message}`,
          });
          return;
        }
        
        toast({
          title: "Cliente criado",
          description: "O cliente foi criado com sucesso.",
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao processar dados: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] sm:max-w-[80%] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
            <ClientFormCompanyInfo form={form} />
            <ClientFormContactInfo form={form} />
            <ClientFormAddressInfo form={form} />
            <ClientFormActions onCancel={onClose} isLoading={isLoading} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormModal;
