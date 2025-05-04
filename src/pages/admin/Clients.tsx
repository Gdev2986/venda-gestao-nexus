
import { Card, CardContent } from "@/components/ui/card";
import { useClientManagement } from "@/hooks/use-client-management";
import ClientsHeader from "@/components/clients/ClientsHeader";
import ClientsFilter from "@/components/clients/ClientsFilter";
import ClientsList from "@/components/clients/ClientsList";
import ClientsPagination from "@/components/clients/ClientsPagination";
import DeleteClientDialog from "@/components/clients/DeleteClientDialog";
import { ClientCreate, ClientUpdate } from "@/types/client";

// Main Clients component definition
const Clients = () => {
  const {
    clients,
    loading,
    error,
    searchTerm,
    currentPage,
    totalPages,
    showFilters,
    formattedPartners,
    selectedClient,
    isDeleteDialogOpen,
    handleSearchChange,
    resetFilters,
    handleCreateClient,
    handleViewClient,
    handleEditClient,
    handleDeleteClick,
    handleDeleteConfirm,
    closeDeleteDialog,
    handlePageChange,
    toggleFilters,
  } = useClientManagement();

  // Function to create a client - updated to handle the required parameter
  const onCreateClient = () => {
    // Navigate to create client page or open modal
    console.log("Create client");
  };

  // Updated function for viewing a client
  const onViewClient = (id: string) => {
    handleViewClient(id);
  };

  // Updated function for editing a client
  const onEditClient = (id: string) => {
    // Navigate to edit page or open edit modal
    console.log("Edit client", id);
  };

  if (error) {
    return (
      <div className="space-y-4">
        <ClientsHeader onCreateClient={onCreateClient} />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive">Erro ao carregar clientes: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ClientsHeader onCreateClient={onCreateClient} />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <ClientsFilter 
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onResetFilters={resetFilters}
              showFiltersToggle={showFilters}
              onToggleFilters={toggleFilters}
            />

            <ClientsList
              clients={clients}
              formattedPartners={formattedPartners}
              loading={loading}
              onViewClient={onViewClient}
              onEditClient={onEditClient}
              onDeleteClient={handleDeleteClick}
            />

            <ClientsPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>

      <DeleteClientDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        clientName={selectedClient?.business_name || selectedClient?.contact_name || "Selecionado"}
      />
    </div>
  );
};

export default Clients;
