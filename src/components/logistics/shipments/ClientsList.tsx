
import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useClients } from "@/hooks/use-clients";
import { useShipments } from "@/hooks/use-shipments";
import ClientShipmentHistoryDialog from "./ClientShipmentHistoryDialog";
import { useClientsTableColumns, ClientWithShipmentCount } from "./clients-list/ClientsTableColumns";
import ClientsSearchSection from "./clients-list/ClientsSearchSection";
import ClientsDebugInfo from "./clients-list/ClientsDebugInfo";
import ClientsEmptyState from "./clients-list/ClientsEmptyState";
import ClientsLoadingState from "./clients-list/ClientsLoadingState";

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { clients, loading: clientsLoading, refreshClients } = useClients();
  const { shipments, isLoading: shipmentsLoading } = useShipments();

  // Combine clients with shipment counts
  const clientsWithShipments: ClientWithShipmentCount[] = (clients || []).map(client => {
    const shipmentCount = shipments.filter(shipment => shipment.client_id === client.id).length;
    return {
      ...client,
      shipmentCount
    };
  });

  const handleViewHistory = (clientId: string, clientName: string) => {
    setSelectedClient({ id: clientId, name: clientName });
    setShowHistory(true);
  };

  const columns = useClientsTableColumns({ onViewHistory: handleViewHistory });

  const filteredClients = clientsWithShipments.filter(client => {
    return searchTerm === "" || 
      client.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Carregar dados quando o componente monta
  React.useEffect(() => {
    if (!clients || clients.length === 0) {
      refreshClients();
    }
  }, []);

  if (clientsLoading || shipmentsLoading) {
    return <ClientsLoadingState />;
  }

  return (
    <div className="space-y-4">
      <ClientsSearchSection 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ClientsDebugInfo 
        clientsCount={clients?.length || 0}
        shipmentsCount={shipments?.length || 0}
      />

      {filteredClients.length > 0 ? (
        <DataTable 
          columns={columns} 
          data={filteredClients}
        />
      ) : (
        <ClientsEmptyState 
          isLoading={clientsLoading}
          onRefresh={refreshClients}
        />
      )}

      {selectedClient && (
        <ClientShipmentHistoryDialog
          open={showHistory}
          onOpenChange={setShowHistory}
          clientId={selectedClient.id}
          clientName={selectedClient.name}
        />
      )}
    </div>
  );
};

export default ClientsList;
