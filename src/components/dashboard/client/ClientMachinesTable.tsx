
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Monitor, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: string;
  created_at: string;
}

export const ClientMachinesTable = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMachines = async () => {
      if (!user?.id) return;

      try {
        // Buscar client_id do usuário
        const { data: clientAccess } = await supabase
          .from('user_client_access')
          .select('client_id')
          .eq('user_id', user.id)
          .single();

        if (!clientAccess) return;

        // Buscar máquinas do cliente
        const { data: machinesData, error } = await supabase
          .from('machines')
          .select('id, serial_number, model, status, created_at')
          .eq('client_id', clientAccess.client_id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setMachines(machinesData || []);
      } catch (error) {
        console.error('Erro ao buscar máquinas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachines();
  }, [user?.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500 hover:bg-green-600">Ativa</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary">Inativa</Badge>;
      case 'MAINTENANCE':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Manutenção</Badge>;
      case 'BLOCKED':
        return <Badge variant="destructive">Bloqueada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Minhas Máquinas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Minhas Máquinas ({machines.length})
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to={PATHS.CLIENT.MACHINES}>
              <Plus className="h-4 w-4 mr-2" />
              Ver Todas
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {machines.length === 0 ? (
          <div className="text-center py-8">
            <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">Nenhuma máquina encontrada</h3>
            <p className="text-muted-foreground">
              Você não possui máquinas registradas no momento.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastrada em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.slice(0, 5).map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell className="font-medium">{machine.model}</TableCell>
                  <TableCell>{machine.serial_number}</TableCell>
                  <TableCell>{getStatusBadge(machine.status)}</TableCell>
                  <TableCell>
                    {new Date(machine.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {machines.length > 5 && (
          <div className="mt-4 text-center">
            <Button asChild variant="link">
              <Link to={PATHS.CLIENT.MACHINES}>
                Ver todas as {machines.length} máquinas
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
