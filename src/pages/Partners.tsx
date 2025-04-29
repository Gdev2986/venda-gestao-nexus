
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon, PenIcon, TrashIcon } from "lucide-react";
import PartnerForm from "@/components/partners/PartnerForm";
import PartnerFilter from "@/components/partners/PartnerFilter";
import { format } from "date-fns";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    search: "",
    dateRange: undefined,
  });

  useEffect(() => {
    fetchPartners();
  }, [filters]);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('partners')
        .select('*');

      // Apply search filter if provided
      if (filters.search && filters.search.trim() !== "") {
        query = query.ilike('business_name', `%${filters.search.trim()}%`);
      }

      // Apply date range filter if provided
      if (filters.dateRange?.from) {
        query = query.gte('created_at', filters.dateRange.from.toISOString());
      }
      
      if (filters.dateRange?.to) {
        // Add one day to include the end date fully
        const endDate = new Date(filters.dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setPartners(data || []);
    } catch (error) {
      console.error("Erro ao carregar parceiros:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar parceiros",
        description: "Não foi possível carregar a lista de parceiros.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedPartner(null);
    setShowCreateForm(true);
  };

  const handleEditClick = (partner) => {
    setSelectedPartner(partner);
    setShowCreateForm(true);
  };

  const handleDeleteClick = async (partner) => {
    if (!window.confirm(`Tem certeza que deseja excluir o parceiro ${partner.business_name}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partner.id);

      if (error) {
        throw error;
      }

      setPartners(partners.filter(p => p.id !== partner.id));
      toast({
        title: "Parceiro excluído",
        description: "O parceiro foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir parceiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir parceiro",
        description: "Não foi possível excluir o parceiro. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setSelectedPartner(null);
    fetchPartners();
  };

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (selectedPartner) {
        // Update
        const { error } = await supabase
          .from('partners')
          .update(data)
          .eq('id', selectedPartner.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Parceiro atualizado",
          description: "O parceiro foi atualizado com sucesso.",
        });
      } else {
        // Create
        const { error } = await supabase
          .from('partners')
          .insert([data]);

        if (error) {
          throw error;
        }

        toast({
          title: "Parceiro cadastrado",
          description: "O parceiro foi cadastrado com sucesso.",
        });
      }
      
      handleFormClose();
    } catch (error) {
      console.error("Erro ao salvar parceiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar parceiro",
        description: "Ocorreu um erro ao salvar o parceiro. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (filterValues) => {
    setFilters(filterValues);
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Parceiros</h2>
          <Button onClick={handleCreateClick}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Parceiro
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Utilize os filtros abaixo para encontrar parceiros específicos.</CardDescription>
          </CardHeader>
          <CardContent>
            <PartnerFilter onFilter={handleFilter} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Parceiros</CardTitle>
            <CardDescription>Listagem completa de parceiros cadastrados no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-6">
                <p>Carregando...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        Nenhum parceiro encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    partners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">{partner.business_name}</TableCell>
                        <TableCell>{partner.contact_name}</TableCell>
                        <TableCell>{partner.email}</TableCell>
                        <TableCell>{partner.phone}</TableCell>
                        <TableCell>
                          {partner.created_at && format(new Date(partner.created_at), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(partner)}>
                              <PenIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(partner)}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {showCreateForm && (
          <PartnerForm 
            isOpen={showCreateForm}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
            initialData={selectedPartner || {
              business_name: "",
              contact_name: "",
              email: "",
              phone: "",
              commission_rate: 0,
              address: "",
              city: "",
              state: "",
              zip: ""
            }}
            title={selectedPartner ? "Editar Parceiro" : "Novo Parceiro"}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Partners;
