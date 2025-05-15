
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Partner } from "@/types";
import PartnerForm, { PartnerFormValues } from "./PartnerForm";
import { useState } from "react";
import { usePartners } from "@/hooks/use-partners";
import { useToast } from "@/hooks/use-toast";

export interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  initialData?: Partner;
  onSubmit?: (data: PartnerFormValues) => Promise<boolean> | void;
}

const PartnerFormModal = ({
  isOpen,
  onClose,
  title = "Novo Parceiro",
  initialData,
  onSubmit,
}: PartnerFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPartner } = usePartners();
  const { toast } = useToast();

  const handleSubmit = async (data: PartnerFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        const result = await onSubmit(data);
        if (result !== false) {
          onClose();
        }
      } else {
        const success = await createPartner({
          ...data,
          company_name: data.company_name,
          commission_rate: data.commission_rate || 0,
        });
        if (success) {
          onClose();
        }
        return success;
      }
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar o parceiro.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <PartnerForm
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
          initialData={initialData}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PartnerFormModal;
