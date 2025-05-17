
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
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "@/types/enums";
import bcrypt from "bcryptjs";

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

  const handleCreateClient = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      // Gerar um UUID para o cliente
      const clientId = uuidv4();

      // 1. Criar cliente
      const clientData = {
        id: clientId,
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
        balance: data.balance || 0,
        status: 'active'
      };

      // Inserir cliente no banco de dados
      const { error: clientError } = await supabase
        .from('clients')
        .insert(clientData);

      if (clientError) {
        throw new Error(`Erro ao criar cliente: ${clientError.message}`);
      }

      // 2. Se houver máquinas selecionadas, associá-las ao cliente
      if (data.machines && data.machines.length > 0) {
        const { error: machinesError } = await supabase
          .from('machines')
          .update({ client_id: clientId })
          .in('id', data.machines);

        if (machinesError) {
          console.error('Erro ao associar máquinas:', machinesError);
          // Não impede o fluxo, apenas loga o erro
        }
      }

      // 3. Criar usuário para o cliente
      const firstName = data.contact_name?.split(' ')[0] || '';
      const phoneDigits = data.phone?.replace(/\D/g, '') || '';
      const lastFourDigits = phoneDigits.slice(-4);
      const initialPassword = `${firstName}${lastFourDigits}`;
      
      // Hash a senha usando bcrypt
      const hashedPassword = await bcrypt.hash(initialPassword, 10);

      // Gerar um UUID para o usuário
      const userId = uuidv4();
      
      // Criar o usuário na tabela profiles
      const { error: userError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: data.contact_name,
          email: data.email,
          role: UserRole.CLIENT,
          phone: data.phone
        });

      if (userError) {
        console.error('Erro ao criar usuário:', userError);
        // Não impede o fluxo, apenas loga o erro
      }

      // 4. Criar relação entre usuário e cliente
      const { error: accessError } = await supabase
        .from('user_client_access')
        .insert({
          user_id: userId,
          client_id: clientId
        });

      if (accessError) {
        console.error('Erro ao associar usuário ao cliente:', accessError);
        // Não impede o fluxo, apenas loga o erro
      }
      
      // Exibir mensagem de sucesso
      toast({
        title: "Cliente criado com sucesso",
        description: `Senha inicial: ${initialPassword}`,
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
