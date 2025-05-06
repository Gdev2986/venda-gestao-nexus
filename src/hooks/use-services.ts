
import { useState, useEffect } from "react";

interface UseServicesParams {
  searchTerm?: string;
  statusFilter?: string;
  typeFilter?: string;
  page?: number;
}

export const useServices = (params: UseServicesParams = {}) => {
  const { searchTerm = "", statusFilter = "all", typeFilter = "all", page = 1 } = params;
  
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchServices();
  }, [searchTerm, statusFilter, typeFilter, currentPage]);
  
  const fetchServices = async () => {
    setIsLoading(true);
    
    try {
      // For the sake of this implementation, we'll mock the data
      setTimeout(() => {
        const mockServices = [
          {
            id: "9876543210abcdef",
            clientId: "1",
            clientName: "Supermercado ABC",
            establishment: "Matriz",
            machineId: "1",
            machineSerial: "SN-123456",
            type: "MAINTENANCE",
            scheduledFor: "2023-06-20T14:30:00Z",
            status: "PENDING",
            notes: "Cliente relatou problemas na impressão"
          },
          {
            id: "1234567890abcdef",
            clientId: "2",
            clientName: "Restaurante XYZ",
            establishment: "Filial Centro",
            machineId: "2",
            machineSerial: "SN-789012",
            type: "PAPER_REPLACEMENT",
            scheduledFor: "2023-06-21T10:00:00Z",
            status: "PENDING",
            notes: "Troca de bobina mensal"
          },
          {
            id: "abcdef1234567890",
            clientId: "3",
            clientName: "Farmácia Central",
            establishment: "Matriz",
            machineId: "3",
            machineSerial: "SN-345678",
            type: "INSTALLATION",
            scheduledFor: "2023-06-22T09:15:00Z",
            status: "IN_PROGRESS",
            notes: "Nova instalação - máquina já separada"
          },
          {
            id: "fedcba0987654321",
            clientId: "1",
            clientName: "Supermercado ABC",
            establishment: "Filial Norte",
            machineId: "4",
            machineSerial: "SN-901234",
            type: "PAPER_DELIVERY",
            scheduledFor: "2023-06-23T16:45:00Z",
            status: "COMPLETED",
            notes: "Entrega de 10 bobinas"
          },
          {
            id: "5678901234abcdef",
            clientId: "4",
            clientName: "Padaria Sabor",
            establishment: "Matriz",
            machineId: "5",
            machineSerial: "SN-567890",
            type: "MAINTENANCE",
            scheduledFor: "2023-06-24T11:30:00Z",
            status: "PENDING",
            notes: "Tela travando durante operação"
          }
        ];
        
        // Filter by search term, status and type
        let filtered = mockServices;
        
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(service => 
            service.clientName.toLowerCase().includes(term) ||
            service.machineSerial.toLowerCase().includes(term) ||
            service.establishment.toLowerCase().includes(term)
          );
        }
        
        if (statusFilter !== "all") {
          filtered = filtered.filter(service => service.status === statusFilter);
        }
        
        if (typeFilter !== "all") {
          filtered = filtered.filter(service => service.type === typeFilter);
        }
        
        setServices(filtered);
        setTotalPages(1); // With real data, calculate based on total count
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching services:", error);
      setIsLoading(false);
    }
  };
  
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const refreshServices = () => {
    fetchServices();
  };
  
  return { 
    services, 
    isLoading, 
    currentPage, 
    totalPages, 
    onPageChange,
    refreshServices
  };
};

export const saveService = async (serviceData: any) => {
  // In a real app, this would save to Supabase
  // For now, just return the data with a mock id
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        ...serviceData,
        createdAt: new Date().toISOString()
      });
    }, 500);
  });
};
