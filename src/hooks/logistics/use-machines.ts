
import { useState, useEffect } from 'react';
import { Machine, MachineStatus } from '@/types/machine.types';
import {
  getMachines,
  getMachinesByStatus,
  createMachine,
  updateMachine,
  deleteMachine,
  transferMachine,
  getMachineStats
} from '@/services/machine.service';

export interface MachineStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  stock: number;
}

export const useMachines = (options?: { enableRealtime?: boolean; initialFetch?: boolean }) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MachineStats>({ total: 0, active: 0, inactive: 0, maintenance: 0, stock: 0 });

  const fetchMachines = async (): Promise<Machine[]> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMachines();
      setMachines(data);
      
      // Calculate stats
      const statsData = await getMachineStats();
      setStats(statsData);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch machines');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMachinesByStatus = async (status: MachineStatus) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMachinesByStatus(status);
      setMachines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch machines by status');
    } finally {
      setIsLoading(false);
    }
  };

  const createMachineHandler = async (machineData: Omit<Machine, 'id' | 'created_at' | 'updated_at' | 'client'>) => {
    try {
      const newMachine = await createMachine(machineData);
      setMachines(prev => [newMachine, ...prev]);
      await fetchMachines(); // Refresh stats
      return newMachine;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create machine');
      throw err;
    }
  };

  const updateMachineHandler = async (id: string, updates: Partial<Omit<Machine, 'id' | 'created_at' | 'updated_at' | 'client'>>) => {
    try {
      const updatedMachine = await updateMachine(id, updates);
      setMachines(prev => prev.map(machine => 
        machine.id === id ? updatedMachine : machine
      ));
      return updatedMachine;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update machine');
      throw err;
    }
  };

  const deleteMachineHandler = async (id: string) => {
    try {
      await deleteMachine(id);
      setMachines(prev => prev.filter(machine => machine.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete machine');
      throw err;
    }
  };

  const transferMachineHandler = async (machineId: string, newClientId: string | null) => {
    try {
      await transferMachine({
        machine_id: machineId,
        to_client_id: newClientId || '',
        cutoff_date: new Date().toISOString()
      });
      await fetchMachines(); // Refresh after transfer
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer machine');
      throw err;
    }
  };

  useEffect(() => {
    if (options?.initialFetch !== false) {
      fetchMachines();
    }
  }, []);

  return {
    machines,
    isLoading,
    error,
    stats,
    refetch: fetchMachines,
    fetchMachines,
    fetchMachinesByStatus,
    createMachine: createMachineHandler,
    updateMachine: updateMachineHandler,
    deleteMachine: deleteMachineHandler,
    transferMachine: transferMachineHandler,
    addMachine: createMachineHandler, // Alias for compatibility
    getMachineStats
  };
};
