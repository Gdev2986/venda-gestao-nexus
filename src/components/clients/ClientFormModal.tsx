
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

export interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const ClientFormModal = ({ isOpen, onClose, title = "Novo Cliente" }: ClientFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addClient } = useClients();
  const { toast } = useToast();

  const handleCreateClient = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert form values to ClientCreate type
      const clientData = {
        business_name: data.business_name,
        contact_name: data.contact_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
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
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormModal;
