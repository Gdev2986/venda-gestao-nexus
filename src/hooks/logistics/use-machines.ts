
import { useState, useEffect } from 'react';
import { Machine, MachineStatus } from '@/types/machine.types';
import {
  getAllMachines,
  getMachinesByStatus,
  createMachine,
  updateMachine,
  deleteMachine,
  transferMachine,
  getMachineStats
} from '@/services/machine.service';

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

  const createMachineHandler = async (machineData: Omit<Machine, 'id' | 'created_at' | 'updated_at' | 'client'>) => {
    try {
      const newMachine = await createMachine(machineData);
      setMachines(prev => [newMachine, ...prev]);
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
    fetchMachines();
  }, []);

  return {
    machines,
    isLoading,
    error,
    refetch: fetchMachines,
    fetchMachinesByStatus,
    createMachine: createMachineHandler,
    updateMachine: updateMachineHandler,
    deleteMachine: deleteMachineHandler,
    transferMachine: transferMachineHandler,
    getMachineStats
  };
};
