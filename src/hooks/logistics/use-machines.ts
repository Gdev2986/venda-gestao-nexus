
import { useState, useEffect } from "react";
import { getAllMachines, getMachineStats } from "@/services/machine.service";
import { Machine } from "@/types/machine.types";

interface MachineStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  blocked: number;
  stock: number;
  transit: number;
  byStatus: Record<string, number>;
}

export const useMachineStats = () => {
  const [stats, setStats] = useState<MachineStats>({
    total: 0,
    active: 0,
    inactive: 0,
    maintenance: 0,
    blocked: 0,
    stock: 0,
    transit: 0,
    byStatus: {},
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getMachineStats();
        setStats({
          total: statsData.total,
          active: statsData.active,
          inactive: statsData.inactive,
          maintenance: statsData.maintenance,
          blocked: statsData.blocked,
          stock: statsData.stock,
          transit: statsData.transit,
          byStatus: {
            'ACTIVE': statsData.active,
            'INACTIVE': statsData.inactive,
            'MAINTENANCE': statsData.maintenance,
            'BLOCKED': statsData.blocked,
            'STOCK': statsData.stock,
            'TRANSIT': statsData.transit,
          }
        });
      } catch (error) {
        console.error("Error fetching machine stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
};

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllMachines();
      setMachines(data);
    } catch (err) {
      console.error('Error fetching machines:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch machines');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  return {
    machines,
    isLoading,
    error,
    refetch: fetchMachines
  };
};
