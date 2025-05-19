
import { useState, useEffect } from "react";
import { usePartners } from "@/hooks/use-partners";
import { Partner } from "@/types";
import { PartnerFormModal } from "@/components/partners/PartnerFormModal";
import PartnersTable from "@/components/partners/PartnersTable";

const Partners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { 
    partners, 
    isLoading, 
    error,
    deletePartner,
    createPartner
  } = usePartners();

  useEffect(() => {
    // Filter partners based on search term
    if (!partners) return;
    
    const filtered = partners.filter(partner => {
      return partner.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    setFilteredPartners(filtered);
  }, [partners, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDelete = async (partnerId: string) => {
    try {
      await deletePartner.mutateAsync(partnerId);
      return true;
    } catch (error) {
      console.error("Error deleting partner:", error);
      return false;
    }
  };

  const handleCreatePartner = async (data: Partial<Partner>) => {
    try {
      await createPartner.mutateAsync(data);
      setShowCreateModal(false);
      return true;
    } catch (error) {
      console.error("Error creating partner:", error);
      return false;
    }
  };

  const handleEditPartner = (partner: Partner) => {
    setEditPartner(partner);
    setShowEditModal(true);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Parceiros</h2>
        </div>
        <button 
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          onClick={handleCreateClick}
        >
          Novo Parceiro
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-6 mt-8">
        {/* Filters card */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-md shadow p-4">
            <h3 className="font-medium mb-4">Filtros</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Buscar</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Nome da empresa"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Partners table card */}
        <div className="md:col-span-4">
          <div className="bg-white rounded-md shadow">
            <div className="p-4 border-b">
              <h3 className="font-medium">Parceiros</h3>
            </div>
            <div className="p-4">
              {error ? (
                <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
                  {error.message}
                </div>
              ) : (
                <PartnersTable 
                  partners={filteredPartners} 
                  isLoading={isLoading}
                  onDelete={(partner) => handleDelete(partner.id)}
                  onEdit={handleEditPartner}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Partner creation modal */}
      <PartnerFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreatePartner}
        isSubmitting={createPartner.isPending}
      />
      
      {/* Partner edit modal */}
      {editPartner && (
        <PartnerFormModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onSubmit={(data) => {
            console.log("Edit partner data:", data);
            setShowEditModal(false);
            return Promise.resolve(true);
          }}
          isSubmitting={false}
          defaultValues={editPartner}
          mode="edit"
        />
      )}
    </div>
  );
};

export default Partners;
