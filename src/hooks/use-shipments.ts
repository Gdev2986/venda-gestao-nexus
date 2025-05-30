
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

      // Converter os dados do Supabase para nossos tipos tipados
      const typedShipments: Shipment[] = (data || []).map(item => ({
        id: item.id,
        client_id: item.client_id,
        item_type: item.item_type as 'machine' | 'bobina' | 'other',
        item_description: item.item_description,
        status: item.status as 'pending' | 'in_transit' | 'delivered' | 'cancelled',
        tracking_code: item.tracking_code,
        notes: item.notes,
        created_by: item.created_by,
        created_at: item.created_at,
        updated_at: item.updated_at,
        delivered_at: item.delivered_at,
        client: item.client,
        creator: item.creator
      }));

      setShipments(typedShipments);
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

      // Converter para tipo tipado
      const typedShipment: Shipment = {
        id: shipment.id,
        client_id: shipment.client_id,
        item_type: shipment.item_type as 'machine' | 'bobina' | 'other',
        item_description: shipment.item_description,
        status: shipment.status as 'pending' | 'in_transit' | 'delivered' | 'cancelled',
        tracking_code: shipment.tracking_code,
        notes: shipment.notes,
        created_by: shipment.created_by,
        created_at: shipment.created_at,
        updated_at: shipment.updated_at,
        delivered_at: shipment.delivered_at,
        client: shipment.client,
        creator: shipment.creator
      };

      setShipments(prev => [typedShipment, ...prev]);
      
      toast({
        title: 'Sucesso',
        description: 'Envio criado com sucesso!'
      });

      return typedShipment;
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
