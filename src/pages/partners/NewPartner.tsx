
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PartnerForm from "@/components/partners/PartnerForm";
import { usePartners } from "@/hooks/use-partners";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/routes/paths";

const NewPartner = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPartner } = usePartners();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const success = await createPartner({
        ...data,
        commission_rate: data.commission_rate || 0
      });

      if (success) {
        toast({
          title: "Sucesso",
          description: "Parceiro criado com sucesso."
        });
        navigate(PATHS.ADMIN.PARTNERS);
        return true;
      } 
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o parceiro."
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <PageHeader 
        title="Novo Parceiro" 
        description="Adicione um novo parceiro ao sistema"
        actionLabel="Voltar"
        actionLink={PATHS.ADMIN.PARTNERS}
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Informações do Parceiro</CardTitle>
        </CardHeader>
        <CardContent>
          <PartnerForm
            isOpen={true}
            onClose={() => navigate(PATHS.ADMIN.PARTNERS)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPartner;
