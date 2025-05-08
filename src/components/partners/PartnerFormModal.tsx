
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PartnerForm, { PartnerFormValues } from "./PartnerForm";
import { usePartners } from "@/hooks/use-partners";

export interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: PartnerFormValues) => Promise<boolean>;
  title?: string;
}

const PartnerFormModal = ({ isOpen, onClose, onSubmit, title = "Novo Parceiro" }: PartnerFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPartner } = usePartners();
  const { toast } = useToast();

  const handleCreatePartner = async (data: PartnerFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      // Prepare partner data with all required fields
      const partnerData = {
        company_name: data.company_name,
        business_name: data.business_name || data.company_name,
        contact_name: data.contact_name || "",
        email: data.email || "",
        phone: data.phone || "",
        commission_rate: data.commission_rate || 0,
        address: "", // Add required field
        total_sales: 0, // Add required field
        total_commission: 0 // Add required field
      };

      // Use provided onSubmit prop if available, otherwise use createPartner
      const success = onSubmit 
        ? await onSubmit(data)
        : await createPartner(partnerData);

      if (success) {
        toast({
          title: "Parceiro criado",
          description: "O parceiro foi criado com sucesso.",
        });
        onClose();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível criar o parceiro.",
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao criar o parceiro.",
      });
      return false;
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
        <PartnerForm
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleCreatePartner}
          isSubmitting={isSubmitting}
          title={title}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PartnerFormModal;
