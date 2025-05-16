
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientStatus, Client } from "@/types";
import { Search, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientDetailsModal } from "@/components/clients/ClientDetailsModal";

const PartnerClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();

  // Fetch clients from Supabase
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("clients")
        .select("*");

      // Apply filters
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      
      if (searchTerm) {
        query = query.or(
          `business_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      setClients(data as Client[]);
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [statusFilter, searchTerm]);

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedClient(null);
  };

  // Calculate client stats
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === ClientStatus.ACTIVE).length;
  const inactiveClients = clients.filter((c) => c.status === ClientStatus.INACTIVE).length;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Clients Management</h1>
          <p className="text-gray-500">View and manage your client accounts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeClients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Inactive Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inactiveClients}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Clients</CardTitle>
                <CardDescription>Manage your client accounts</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Client
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={ClientStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={ClientStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={ClientStatus.PENDING}>Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ClientsTable 
              clients={clients} 
              isLoading={isLoading} 
              onEdit={handleClientClick}
              onDelete={() => {}} // Provide an empty function for now
              onView={handleClientClick}
            />
          </CardContent>
        </Card>
      </div>

      {selectedClient && (
        <ClientDetailsModal
          isOpen={showDetailsModal}
          onClose={handleCloseModal}
          client={selectedClient}
        />
      )}
    </div>
  );
};

export default PartnerClientsPage;
