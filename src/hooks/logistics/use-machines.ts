
import { useState, useEffect } from "react";

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
        const mockStats = {
          total: 100,
          active: 75,
          inactive: 10,
          maintenance: 8,
          blocked: 2,
          stock: 3,
          transit: 2,
          byStatus: {
            'ACTIVE': 75,
            'INACTIVE': 10,
            'MAINTENANCE': 8,
            'BLOCKED': 2,
            'STOCK': 3,
            'TRANSIT': 2,
          }
        };
        setStats(mockStats);
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
