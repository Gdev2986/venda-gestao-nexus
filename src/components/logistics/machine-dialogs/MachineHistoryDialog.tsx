
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface MachineHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  machineId?: string;
}

interface TransferRecord {
  id: string;
  transfer_date: string;
  from_client_name: string | null;
  to_client_name: string;
  location: string | null;
}

export function MachineHistoryDialog({
  isOpen,
  onClose,
  machineId,
}: MachineHistoryDialogProps) {
  const [historyRecords, setHistoryRecords] = useState<TransferRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && machineId) {
      fetchMachineHistory();
    }
  }, [isOpen, machineId]);

  const fetchMachineHistory = async () => {
    if (!machineId) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch actual history from Supabase
      // For now, we'll use mock data
      setTimeout(() => {
        setHistoryRecords([
          {
            id: "1",
            transfer_date: "2025-03-15T10:30:00Z",
            from_client_name: null,
            to_client_name: "Supermercado ABC",
            location: "Matriz",
          },
          {
            id: "2",
            transfer_date: "2025-04-10T14:20:00Z",
            from_client_name: "Supermercado ABC",
            to_client_name: "Farmácia Central",
            location: "Filial Centro",
          },
          {
            id: "3",
            transfer_date: "2025-05-01T09:15:00Z",
            from_client_name: "Farmácia Central",
            to_client_name: "Padaria Sabor",
            location: "Unidade 2",
          },
        ]);
        setIsLoading(false);
      }, 500);

      // Actual Supabase implementation would be something like:
      /*
      const { data, error } = await supabase
        .from('machine_transfers')
        .select(`
          id,
          transfer_date,
          from_client:from_client_id(business_name),
          to_client:to_client_id(business_name),
          location
        `)
        .eq('machine_id', machineId)
        .order('transfer_date', { ascending: false });

      if (error) throw error;

      setHistoryRecords(data.map(item => ({
        id: item.id,
        transfer_date: item.transfer_date,
        from_client_name: item.from_client?.business_name || null,
        to_client_name: item.to_client.business_name,
        location: item.location,
      })));
      */
    } catch (error) {
      console.error("Error fetching machine history:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar o histórico da máquina.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Histórico de Transferências</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : historyRecords.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Nenhum histórico de transferência encontrado para esta máquina.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>De</TableHead>
                <TableHead>Para</TableHead>
                <TableHead>Local</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.transfer_date)}</TableCell>
                  <TableCell>
                    {record.from_client_name || (
                      <span className="text-muted-foreground italic">Estoque</span>
                    )}
                  </TableCell>
                  <TableCell>{record.to_client_name}</TableCell>
                  <TableCell>
                    {record.location || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
