
import { useState } from "react";
import { useClients } from "@/hooks/use-clients";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClientForm, { ClientFormValues } from "./ClientForm";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/enums";

export interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  initialData?: ClientFormValues;
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
  const { user } = useAuth();

  const handleCreateClient = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Make sure the data matches the ClientCreate type
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
        partner_id: data.partner_id || null,
      };
      
      // Ao criar o cliente agora não precisamos fornecer um ID
      // O banco de dados vai gerar automaticamente
      const result = await addClient(clientData);
      
      if (!result) {
        throw new Error("Erro ao criar cliente");
      }
      
      // If the client has machines, associate them
      if (data.machines && data.machines.length > 0 && result) {
        const { error: machinesError } = await supabase
          .from('machines')
          .update({ client_id: result.id })
          .in('id', data.machines);

        if (machinesError) {
          console.error('Erro ao associar máquinas:', machinesError);
          // Not failing the entire process if just machine association fails
          toast({
            variant: "destructive",
            title: "Atenção",
            description: "Cliente criado, mas houve erro ao associar máquinas.",
          });
        }
      }
      
      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso.",
      });
      
      onClose();
      return true;
    } catch (error: any) {
      console.error('Erro durante a criação do cliente:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível criar o cliente.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ClientForm
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={externalSubmit || handleCreateClient}
          isSubmitting={isSubmitting}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormModal;
