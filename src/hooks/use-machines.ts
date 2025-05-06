
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
            createdAt: "2023-01-15T10:30:00Z"
          },
          {
            id: "2",
            serialNumber: "SN-789012",
            model: "Terminal Standard",
            status: "MAINTENANCE",
            clientId: "2",
            clientName: "Restaurante XYZ",
            createdAt: "2023-02-20T14:45:00Z"
          },
          {
            id: "3",
            serialNumber: "SN-345678",
            model: "Terminal Mini",
            status: "INACTIVE",
            clientId: "3",
            clientName: "Farmácia Central",
            createdAt: "2023-03-10T09:15:00Z"
          },
          {
            id: "4",
            serialNumber: "SN-901234",
            model: "Terminal Pro",
            status: "ACTIVE",
            clientId: "1",
            clientName: "Supermercado ABC",
            createdAt: "2023-04-05T11:20:00Z"
          },
          {
            id: "5",
            serialNumber: "SN-567890",
            model: "Terminal Standard",
            status: "REPLACEMENT_REQUESTED",
            clientId: "4",
            clientName: "Padaria Sabor",
            createdAt: "2023-05-18T16:10:00Z"
          }
        ];
        
        // Filter by search term and status
        let filtered = mockMachines;
        
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(machine => 
            machine.serialNumber.toLowerCase().includes(term) ||
            machine.model.toLowerCase().includes(term) ||
            machine.clientName.toLowerCase().includes(term)
          );
        }
        
        if (statusFilter !== "all") {
          filtered = filtered.filter(machine => machine.status === statusFilter);
        }
        
        setMachines(filtered);
        setTotalPages(1); // With real data, calculate based on total count
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching machines:", error);
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
  // For now, just return the data with a mock id
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substring(2, 9),
        ...machineData,
        createdAt: new Date().toISOString()
      });
    }, 500);
  });
};
