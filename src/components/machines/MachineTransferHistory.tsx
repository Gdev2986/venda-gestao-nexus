
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TransferRecord {
  transfer_id: string;
  from_client_id: string | null;
  from_client_name: string | null;
  to_client_id: string;
  to_client_name: string;
  transfer_date: string;
  cutoff_date: string;
  created_by: string | null;
  notes: string | null;
}

interface MachineTransferHistoryProps {
  machineId: string;
}

export const MachineTransferHistory: React.FC<MachineTransferHistoryProps> = ({
  machineId
}) => {
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransferHistory();
  }, [machineId]);

  const fetchTransferHistory = async () => {
    try {
      const { data, error } = await supabase.rpc('get_machine_transfer_history', {
        p_machine_id: machineId
      });

      if (error) throw error;
      setTransfers(data || []);
    } catch (error) {
      console.error('Error fetching transfer history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico de Transferências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  if (transfers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico de Transferências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhuma transferência registrada</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="h-4 w-4" />
          Histórico de Transferências
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transfers.map((transfer) => (
          <div key={transfer.transfer_id} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">
                  {transfer.from_client_name || "Estoque"}
                </Badge>
                <ArrowRight className="h-3 w-3" />
                <Badge variant="outline">
                  {transfer.to_client_name}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(transfer.transfer_date)}
              </span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <strong>Data de Corte:</strong> {formatDate(transfer.cutoff_date)}
            </div>
            
            {transfer.notes && (
              <div className="text-xs text-muted-foreground">
                <strong>Observações:</strong> {transfer.notes}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
