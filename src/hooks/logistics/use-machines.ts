
import { useState, useEffect } from 'react';
import { Machine, MachineStats, MachineStatus } from '@/types/machine.types';
import { supabase } from '@/integrations/supabase/client';

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('machines')
        .select('*');

      if (error) throw error;

      setMachines(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar máquinas');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (machineList: Machine[]): MachineStats => {
    const stats = {
      total: machineList.length,
      active: 0,
      inactive: 0,
      maintenance: 0,
      blocked: 0,
      stock: 0,
      transit: 0,
      byStatus: {} as Record<MachineStatus, number>
    };

    // Initialize byStatus with all statuses
    Object.values(MachineStatus).forEach(status => {
      stats.byStatus[status] = 0;
    });

    machineList.forEach(machine => {
      stats.byStatus[machine.status]++;
      
      switch (machine.status) {
        case MachineStatus.ACTIVE:
          stats.active++;
          break;
        case MachineStatus.INACTIVE:
          stats.inactive++;
          break;
        case MachineStatus.MAINTENANCE:
          stats.maintenance++;
          break;
        case MachineStatus.BLOCKED:
          stats.blocked++;
          break;
        case MachineStatus.STOCK:
          stats.stock++;
          break;
        case MachineStatus.TRANSIT:
          stats.transit++;
          break;
      }
    });

    return stats;
  };

  const updateMachine = async (id: string, updates: Partial<Machine>) => {
    try {
      const { error } = await supabase
        .from('machines')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMachines(prev => prev.map(machine => 
        machine.id === id ? { ...machine, ...updates } : machine
      ));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar máquina');
    }
  };

  const deleteMachine = async (id: string) => {
    try {
      const { error } = await supabase
        .from('machines')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMachines(prev => prev.filter(machine => machine.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao deletar máquina');
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const stats = calculateStats(machines);

  return {
    machines,
    stats,
    loading,
    error,
    refetch: fetchMachines,
    updateMachine,
    deleteMachine
  };
};
