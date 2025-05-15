
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PartnerForm from "@/components/partners/PartnerForm";
import { usePartners } from "@/hooks/use-partners";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/routes/paths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Download } from "lucide-react";
import { Partner } from "@/types";

const NewPartner = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { createPartner, partners, filterPartners } = usePartners();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterPartners(e.target.value, undefined);
  };

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
        setIsCreateModalOpen(false);
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

  // Simulated data for the sample stats
  const totalPartners = partners?.length || 0;
  const activePartners = partners?.filter(p => p.id.length % 2 === 1).length || 0;
  const averageCommission = partners && partners.length > 0
    ? (partners.reduce((sum, p) => sum + (p.commission_rate || 0), 0) / partners.length).toFixed(2)
    : "0.00";

  return (
    <div className="container mx-auto py-10 space-y-6">
      <PageHeader 
        title="Parceiros" 
        description="Gerencie os parceiros e consultores do sistema"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-muted-foreground text-sm">Total de Parceiros</div>
            <div className="text-3xl font-bold mt-1">{totalPartners}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-muted-foreground text-sm">Parceiros Ativos</div>
            <div className="text-3xl font-bold mt-1">{activePartners}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-muted-foreground text-sm">Comissão Média</div>
            <div className="text-3xl font-bold mt-1">{averageCommission}%</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar parceiros..."
            className="pl-8 bg-background w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Exportar PDF</span>
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </Button>
          
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Novo Parceiro</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parceiros</CardTitle>
        </CardHeader>
        <CardContent>
          {partners && partners.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Telefone</th>
                    <th className="text-left py-3 px-4">Comissão</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.slice(0, 5).map((partner) => (
                    <tr key={partner.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{partner.company_name}</td>
                      <td className="py-3 px-4">{partner.email || '-'}</td>
                      <td className="py-3 px-4">{partner.phone || '-'}</td>
                      <td className="py-3 px-4">{partner.commission_rate}%</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          partner.id.length % 2 === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {partner.id.length % 2 === 0 ? 'Inativo' : 'Ativo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`${PATHS.ADMIN.PARTNERS}/${partner.id}`)}>
                          Ver detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {partners.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => navigate(PATHS.ADMIN.PARTNERS)}>
                    Ver todos os parceiros
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {searchTerm ? 'Nenhum parceiro encontrado para esta busca.' : 'Nenhum parceiro cadastrado.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Partner Form Dialog */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]">
            <Card>
              <CardHeader>
                <CardTitle>Novo Parceiro</CardTitle>
              </CardHeader>
              <CardContent>
                <PartnerForm
                  isOpen={isCreateModalOpen}
                  onClose={() => setIsCreateModalOpen(false)}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  hideCommissionRate={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPartner;
