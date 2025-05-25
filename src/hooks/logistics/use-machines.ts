
import { useState, useEffect } from 'react';
import { Machine, MachineStatus, MachineStats } from '@/types/machine.types';
import {
  getAllMachines,
  getMachinesByStatus,
  createMachine,
  updateMachine,
  deleteMachine,
  transferMachine,
  getMachineStats
} from '@/services/machine.service';

export const useMachines = (options?: { enableRealtime?: boolean; initialFetch?: boolean }) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MachineStats>({
    total: 0,
    active: 0,
    inactive: 0,
    maintenance: 0,
    blocked: 0,
    stock: 0,
    transit: 0,
    byStatus: {}
  });

  const fetchMachines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllMachines();
      setMachines(data);
      
      // Update stats
      const statsData = await getMachineStats();
      setStats({
        ...statsData,
        byStatus: statsData.byStatus || {}
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch machines');
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

  const addMachine = async (machineData: Omit<Machine, 'id' | 'created_at' | 'updated_at' | 'client'>) => {
    try {
      const newMachine = await createMachine(machineData);
      setMachines(prev => [newMachine, ...prev]);
      // Refresh stats
      const statsData = await getMachineStats();
      setStats({
        ...statsData,
        byStatus: statsData.byStatus || {}
      });
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
      // Refresh stats
      const statsData = await getMachineStats();
      setStats({
        ...statsData,
        byStatus: statsData.byStatus || {}
      });
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
      // Refresh stats
      const statsData = await getMachineStats();
      setStats({
        ...statsData,
        byStatus: statsData.byStatus || {}
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete machine');
      throw err;
    }
  };

  const transferMachineHandler = async (machineId: string, newClientId: string | null) => {
    try {
      const updatedMachine = await transferMachine(machineId, newClientId);
      setMachines(prev => prev.map(machine => 
        machine.id === machineId ? updatedMachine : machine
      ));
      return updatedMachine;
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
    addMachine,
    updateMachine: updateMachineHandler,
    deleteMachine: deleteMachineHandler,
    transferMachine: transferMachineHandler,
    getMachineStats
  };
};
