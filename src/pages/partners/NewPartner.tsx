import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { PartnerForm } from "@/components/partners/PartnerForm";
import { usePartners } from "@/hooks/use-partners";
import { PATHS } from "@/routes/paths";
import { useToast } from "@/hooks/use-toast";

const NewPartner = () => {
  const navigate = useNavigate();
  const { createPartner, filterPartners } = usePartners();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createPartner(data);
      toast({
        title: "Parceiro criado com sucesso!",
        description: "Redirecionando para a lista de parceiros...",
      });
      setTimeout(() => {
        navigate(PATHS.ADMIN.PARTNERS);
      }, 1500);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar parceiro",
        description: error.message,
      });
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
            <PartnerForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </PageWrapper>
    </>
  );
};

export default NewPartner;
