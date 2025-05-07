
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MachineStats {
  totalMachines: number;
  activeMachines: number;
  inactiveMachines: number;
  pendingServices: number;
  completedServices: number;
  serviceSuccessRate: number;
}

export const useMachineStats = (dateRange: { from: Date; to?: Date }) => {
  const [stats, setStats] = useState<MachineStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchMachineStats();
  }, [dateRange]);
  
  const fetchMachineStats = async () => {
    setIsLoading(true);
    
    try {
      // For this implementation, we'll use mock data
      // In a real application, you would make a Supabase query here
      
      setTimeout(() => {
        const mockStats: MachineStats = {
          totalMachines: 150,
          activeMachines: 120,
          inactiveMachines: 30,
          pendingServices: 15,
          completedServices: 87,
          serviceSuccessRate: 92
        };
        
        setStats(mockStats);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error fetching machine stats:", error);
      setIsLoading(false);
    }
  };
  
  const refreshStats = () => {
    fetchMachineStats();
  };
  
  return {
    stats,
    isLoading,
    refreshStats
  };
};
