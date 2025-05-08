
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export interface MachineHistoryDialogProps {
  machineId: string;
  machineName: string;
  onOpenChange: () => void;
}

interface HistoryItem {
  id: string;
  date: string;
  action: string;
  user: string;
  description: string;
}

export function MachineHistoryDialog({
  machineId,
  machineName,
  onOpenChange,
}: MachineHistoryDialogProps) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Simulate API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock data
        const mockHistory: HistoryItem[] = [
          {
            id: "1",
            date: new Date(2023, 5, 15, 14, 30).toISOString(),
            action: "Criação",
            user: "Admin",
            description: "Máquina cadastrada no sistema",
          },
          {
            id: "2",
            date: new Date(2023, 6, 20, 10, 15).toISOString(),
            action: "Atribuição",
            user: "Gerente",
            description: "Máquina atribuída ao cliente ABC Comércio",
          },
          {
            id: "3",
            date: new Date(2023, 7, 5, 16, 45).toISOString(),
            action: "Manutenção",
            user: "Técnico",
            description: "Manutenção preventiva realizada",
          },
          {
            id: "4",
            date: new Date(2023, 8, 12, 9, 30).toISOString(),
            action: "Transferência",
            user: "Supervisor",
            description: "Transferida para o cliente XYZ Distribuidora",
          },
          {
            id: "5",
            date: new Date(2023, 9, 30, 11, 20).toISOString(),
            action: "Atualização",
            user: "Técnico",
            description: "Atualização de software para versão 2.3.1",
          },
        ];

        setHistoryItems(mockHistory);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching machine history:", error);
        toast({
          title: "Erro ao carregar histórico",
          description: "Não foi possível carregar o histórico da máquina.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [machineId, toast]);

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico da Máquina</DialogTitle>
          <DialogDescription>
            Histórico completo de eventos da máquina {machineName} (ID: {machineId.substring(0, 8)}...)
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : historyItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {format(new Date(item.date), "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum registro encontrado para esta máquina.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MachineHistoryDialog;
