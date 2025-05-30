
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shipment, CreateShipmentData, UpdateShipmentData } from '@/types/shipment.types';
import { useAuth } from '@/hooks/use-auth';

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchShipments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          client:clients(id, business_name),
          creator:profiles!shipments_created_by_fkey(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setShipments(data || []);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar envios';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createShipment = async (data: CreateShipmentData): Promise<Shipment | null> => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { data: shipment, error } = await supabase
        .from('shipments')
        .insert({
          ...data,
          created_by: user.id
        })
        .select(`
          *,
          client:clients(id, business_name),
          creator:profiles!shipments_created_by_fkey(id, name)
        `)
        .single();

      if (error) throw error;

      setShipments(prev => [shipment, ...prev]);
      
      toast({
        title: 'Sucesso',
        description: 'Envio criado com sucesso!'
      });

      return shipment;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar envio';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateShipment = async (id: string, data: UpdateShipmentData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('shipments')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      // Refresh the shipments list to get updated data
      await fetchShipments();
      
      toast({
        title: 'Sucesso',
        description: 'Envio atualizado com sucesso!'
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar envio';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteShipment = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setShipments(prev => prev.filter(shipment => shipment.id !== id));
      
      toast({
        title: 'Sucesso',
        description: 'Envio excluído com sucesso!'
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir envio';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  };

  const getShipmentStats = () => {
    const totalShipments = shipments.length;
    const pendingShipments = shipments.filter(s => s.status === 'pending').length;
    const inTransitShipments = shipments.filter(s => s.status === 'in_transit').length;
    const deliveredShipments = shipments.filter(s => s.status === 'delivered').length;
    const cancelledShipments = shipments.filter(s => s.status === 'cancelled').length;

    return {
      totalShipments,
      pendingShipments,
      inTransitShipments,
      deliveredShipments,
      cancelledShipments
    };
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return {
    shipments,
    isLoading,
    error,
    fetchShipments,
    createShipment,
    updateShipment,
    deleteShipment,
    getShipmentStats
  };
};
