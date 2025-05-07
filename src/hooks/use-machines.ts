
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseMachinesParams {
  searchTerm?: string;
  statusFilter?: string;
  page?: number;
}

export const useMachines = (params: UseMachinesParams = {}) => {
  const { searchTerm = "", statusFilter = "all", page = 1 } = params;
  
  const [machines, setMachines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchMachines();
  }, [searchTerm, statusFilter, currentPage]);
  
  const fetchMachines = async () => {
    setIsLoading(true);
    
    try {
      // For the sake of this implementation, we'll mock the data
      setTimeout(() => {
        const mockMachines = [
          {
            id: "1",
            serialNumber: "SN-123456",
            model: "Terminal Pro",
            status: "ACTIVE",
            clientId: "1",
            clientName: "Supermercado ABC",
            location: "Matriz",
            createdAt: "2023-01-15T10:30:00Z",
            updatedAt: "2023-01-15T10:30:00Z"
          },
          {
            id: "2",
            serialNumber: "SN-789012",
            model: "Terminal Standard",
            status: "MAINTENANCE",
            clientId: "2",
            clientName: "Restaurante XYZ",
            location: "Unidade Central",
            createdAt: "2023-02-20T14:45:00Z",
            updatedAt: "2023-03-15T09:20:00Z"
          },
          {
            id: "3",
            serialNumber: "SN-345678",
            model: "Terminal Mini",
            status: "INACTIVE",
            clientId: "3",
            clientName: "Farmácia Central",
            location: "Filial Norte",
            createdAt: "2023-03-10T09:15:00Z",
            updatedAt: "2023-03-10T09:15:00Z"
          },
          {
            id: "4",
            serialNumber: "SN-901234",
            model: "Terminal Pro",
            status: "ACTIVE",
            clientId: "1",
            clientName: "Supermercado ABC",
            location: "Filial Sul",
            createdAt: "2023-04-05T11:20:00Z",
            updatedAt: "2023-04-05T11:20:00Z"
          },
          {
            id: "5",
            serialNumber: "SN-567890",
            model: "Terminal Standard",
            status: "STOCK",
            clientId: null,
            clientName: null,
            location: "Estoque Central",
            createdAt: "2023-05-18T16:10:00Z",
            updatedAt: "2023-06-02T14:35:00Z"
          }
        ];
        
        // Filter by search term and status
        let filtered = mockMachines;
        
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(machine => 
            machine.serialNumber.toLowerCase().includes(term) ||
            machine.model.toLowerCase().includes(term) ||
            (machine.clientName && machine.clientName.toLowerCase().includes(term)) ||
            (machine.location && machine.location.toLowerCase().includes(term))
          );
        }
        
        if (statusFilter !== "all") {
          filtered = filtered.filter(machine => machine.status === statusFilter);
        }
        
        setMachines(filtered);
        setTotalPages(1); // With real data, calculate based on total count
        setIsLoading(false);
      }, 500);

      // In a real implementation, this would use Supabase:
      /*
      let query = supabase
        .from('machines')
        .select(`
          id,
          serial_number,
          model,
          status,
          client_id,
          clients:client_id (
            business_name
          ),
          machine_transfers (
            location
          )
        `)
        .order('created_at', { ascending: false });
        
      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      if (searchTerm) {
        query = query.or(`serial_number.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
      }
        
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
      
      const formattedMachines = data.map(item => ({
        id: item.id,
        serialNumber: item.serial_number,
        model: item.model,
        status: item.status,
        clientId: item.client_id,
        clientName: item.clients?.business_name || null,
        location: item.machine_transfers[0]?.location || null,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      
      setMachines(formattedMachines);
      */
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const refreshMachines = () => {
    fetchMachines();
  };
  
  return { 
    machines, 
    isLoading, 
    currentPage, 
    totalPages, 
    onPageChange,
    refreshMachines
  };
};

export const saveMachine = async (machineData: any) => {
  // In a real app, this would save to Supabase
  // For now, just return the data with a mock id if it's new, or the same id if updating
  return new Promise((resolve) => {
    setTimeout(() => {
      if (machineData.id) {
        // Update existing machine
        resolve({
          ...machineData,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create new machine
        resolve({
          id: Math.random().toString(36).substring(2, 9),
          ...machineData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }, 500);
  });
};
