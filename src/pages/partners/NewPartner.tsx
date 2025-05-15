
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import PartnerForm from "@/components/partners/PartnerForm";
import { usePartners } from "@/hooks/use-partners";
import { PATHS } from "@/routes/paths";
import { useToast } from "@/hooks/use-toast";
import { Partner } from "@/types";

interface PartnerFormData {
  company_name: string;
  commission_rate: number;
  [key: string]: any;
}

const NewPartner = () => {
  const navigate = useNavigate();
  const { createPartner } = usePartners();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present
      const partnerData = {
        company_name: data.company_name,
        commission_rate: Number(data.commission_rate) || 0,
      };
      
      const success = await createPartner(partnerData);
      
      if (success) {
        toast({
          title: "Parceiro criado com sucesso!",
          description: "Redirecionando para a lista de parceiros...",
        });
        setTimeout(() => {
          navigate(PATHS.ADMIN.PARTNERS);
        }, 1500);
      }
      return success;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar parceiro",
        description: error.message,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Novo Parceiro"
        description="Adicionar um novo parceiro ao sistema"
        actionLabel="Voltar para Parceiros"
        actionLink={PATHS.ADMIN.PARTNERS}
      />
      <PageWrapper>
        <Card>
          <CardContent className="p-8">
            <PartnerForm 
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting} 
              isOpen={true}
              onClose={() => navigate(PATHS.ADMIN.PARTNERS)}
            />
          </CardContent>
        </Card>
      </PageWrapper>
    </>
  );
};

export default NewPartner;
