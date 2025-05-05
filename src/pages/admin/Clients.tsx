
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PATHS } from "@/routes/paths";
import { useClientsAdmin } from "@/hooks/use-clients-admin";
import { Client } from "@/types";
import ClientsList from "@/components/clients/ClientsList";
import { ClientsFilter, ClientFilters } from "@/components/clients/ClientsFilter";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export interface ClientDeleteDialogProps {
  open: boolean;
  clientName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AdminClients = () => {
  const navigate = useNavigate();
  const { 
    clients,
    partners,
    feePlans,
    loading,
    totalPages,
    currentPage,
    removeClient,
    handlePageChange
  } = useClientsAdmin();

  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<ClientDeleteDialogProps>({
    open: false,
    clientName: "",
    onConfirm: () => {},
    onCancel: () => {}
  });

  // Apply any filters
  useEffect(() => {
    setFilteredClients(clients);
  }, [clients]);

  // Handle client filtering
  const handleFilter = (filters: ClientFilters) => {
    let filtered = [...clients];
    
    // Apply text search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(client => 
        (client.business_name?.toLowerCase().includes(search) || 
        client.email?.toLowerCase().includes(search) ||
        client.phone?.toLowerCase().includes(search))
      );
    }
    
    // Apply partner filter
    if (filters.partnerId) {
      filtered = filtered.filter(client => client.partner_id === filters.partnerId);
    }
    
    // Apply fee plan filter
    if (filters.feePlanId) {
      filtered = filtered.filter(client => client.fee_plan_id === filters.feePlanId);
    }
    
    // Apply balance range filter
    if (filters.balanceRange) {
      const [min, max] = filters.balanceRange;
      filtered = filtered.filter(
        client => client.balance != null && client.balance >= min && client.balance <= max
      );
    }
    
    setFilteredClients(filtered);
  };

  // Actions
  const handleViewClient = (id: string) => {
    navigate(PATHS.ADMIN.CLIENT_DETAILS(id));
  };

  const handleEditClient = (id: string) => {
    navigate(PATHS.ADMIN.CLIENT_DETAILS(id)); // Will navigate to the same page for now
  };

  const handleDeleteClient = (id: string, name?: string) => {
    setDeleteDialog({
      open: true,
      clientName: name || "este cliente",
      onConfirm: async () => {
        await removeClient(id);
        setDeleteDialog(prev => ({ ...prev, open: false }));
      },
      onCancel: () => {
        setDeleteDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Clientes" 
        description="Gerencie todos os clientes do sistema"
        actionLabel="Adicionar Cliente"
        actionLink={PATHS.ADMIN.CLIENT_NEW}
      />

      <ClientsFilter 
        partners={partners}
        feePlans={feePlans}
        onFilter={handleFilter}
      />
      
      <PageWrapper>
        <div className="space-y-4">
          <ClientsList
            clients={filteredClients}
            loading={loading}
            onViewClient={handleViewClient}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
          />
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </PageWrapper>

      <AlertDialog open={deleteDialog.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja deletar o cliente {deleteDialog.clientName}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={deleteDialog.onCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteDialog.onConfirm} className="bg-destructive text-destructive-foreground">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminClients;
