
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePartners } from "@/hooks/use-partners";
import { useFeePlans } from "@/hooks/use-fee-plans";
import { PATHS } from "@/routes/paths";
import { Partner } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const NewPartner = () => {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [feePlanId, setFeePlanId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createPartner } = usePartners();
  const { feePlans, isLoading: isLoadingFeePlans } = useFeePlans();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome da empresa é obrigatório."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createPartner.mutateAsync({
        company_name: companyName,
        contact_name: contactName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        fee_plan_id: feePlanId || undefined
      });
      
      toast({
        title: "Sucesso",
        description: "Parceiro criado com sucesso."
      });
      
      // Navigate back to partners list
      navigate(PATHS.ADMIN.PARTNERS);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao criar parceiro."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Novo Parceiro</h1>
          <p className="text-muted-foreground">
            Adicione um novo parceiro de negócio
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Informações do Parceiro</CardTitle>
            <CardDescription>
              Preencha os dados do novo parceiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa *</Label>
                <Input 
                  id="company-name" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-name">Nome do Contato</Label>
                <Input 
                  id="contact-name" 
                  value={contactName} 
                  onChange={(e) => setContactName(e.target.value)} 
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fee-plan">Plano de Taxas</Label>
                <Select
                  value={feePlanId}
                  onValueChange={setFeePlanId}
                >
                  <SelectTrigger id="fee-plan">
                    <SelectValue placeholder="Selecione um plano de taxas" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingFeePlans ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Carregando planos...</span>
                      </div>
                    ) : (
                      <>
                        <SelectItem value="">Plano Padrão</SelectItem>
                        {feePlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(PATHS.ADMIN.PARTNERS)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar Parceiro"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Informações Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Planos de Taxas</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  O plano de taxas define as comissões que serão aplicadas às vendas
                  realizadas pelos clientes associados a este parceiro.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Clientes</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Após criar um parceiro, você poderá associar clientes a ele 
                  através da seção de clientes.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Relatórios</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Os relatórios de comissões estarão disponíveis na seção de 
                  relatórios financeiros após a criação do parceiro.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewPartner;
