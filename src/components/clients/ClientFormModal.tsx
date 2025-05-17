
import { useState } from "react";
import { useClients } from "@/hooks/use-clients";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClientForm, { ClientFormValues } from "./ClientForm";
import { Client } from "@/types";

export interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  initialData?: Client;
  onSubmit?: (data: ClientFormValues) => Promise<boolean>;
}

const ClientFormModal = ({ 
  isOpen, 
  onClose, 
  title = "Novo Cliente",
  initialData,
  onSubmit: externalSubmit 
}: ClientFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addClient } = useClients();
  const { toast } = useToast();

  const handleCreateClient = async (data: ClientFormValues) => {
    // If external submit handler is provided, use that
    if (externalSubmit) {
      return externalSubmit(data);
    }

    setIsSubmitting(true);
    try {
      // Convert form values to proper client data format with optional fields
      const clientData = {
        business_name: data.business_name,
        contact_name: data.contact_name || undefined, // Make optional to match Client type
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zip: data.zip || undefined,
        document: data.document,
        partner_id: data.partner_id
      };

      const result = await addClient(clientData);

      if (result) {
        toast({
          title: "Cliente criado",
          description: "O cliente foi criado com sucesso.",
        });
        onClose();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível criar o cliente.",
        });
        return false;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ClientForm
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleCreateClient}
          isSubmitting={isSubmitting}
          title={title}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormModal;
