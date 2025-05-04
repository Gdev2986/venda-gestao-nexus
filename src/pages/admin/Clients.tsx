
import { Card, CardContent } from "@/components/ui/card";
import { useClientManagement } from "@/hooks/use-client-management";
import ClientsHeader from "@/components/clients/ClientsHeader";
import ClientsFilter from "@/components/clients/ClientsFilter";
import ClientsList from "@/components/clients/ClientsList";
import ClientsPagination from "@/components/clients/ClientsPagination";
import DeleteClientDialog from "@/components/clients/DeleteClientDialog";

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

  if (error) {
    return (
      <div className="space-y-4">
        <ClientsHeader onCreateClient={handleCreateClient} />
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
      <ClientsHeader onCreateClient={handleCreateClient} />

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
              onViewClient={handleViewClient}
              onEditClient={handleEditClient}
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
        clientName={selectedClient?.name}
      />
    </div>
  );
};

export default Clients;
