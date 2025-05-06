
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

interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const PartnerFormModal = ({ isOpen, onClose, title = "Novo Parceiro" }: PartnerFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPartner } = usePartners();
  const { toast } = useToast();

  const handleCreatePartner = async (data: PartnerFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare partner data
      const partnerData = {
        company_name: data.company_name,
        business_name: data.business_name || data.company_name,
        contact_name: data.contact_name || "",
        email: data.email || "",
        phone: data.phone || "",
        commission_rate: data.commission_rate || 0
      };

      const success = await createPartner(partnerData);

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
