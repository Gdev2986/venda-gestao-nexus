import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Machine } from "@/types";
import { PATHS } from "@/routes/paths";

const Machines = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const [clientId, setClientId] = useState<string | null>(null);

  // Fetch client data and ID
  const fetchClientData = async () => {
    if (!user) return;

    try {
      const { data: clientAccessData, error: clientAccessError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (clientAccessError || !clientAccessData) {
        console.error("Erro ao buscar acesso do cliente:", clientAccessError);
        return;
      }

      setClientId(clientAccessData.client_id);
    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
    }
  };

  const fetchMachines = async () => {
    if (!clientId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('client_id', clientId);

      if (error) throw error;

      setMachines(data || []);
    } catch (error) {
      console.error("Erro ao carregar máquinas:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as máquinas."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [user]);

  useEffect(() => {
    if (clientId) {
      fetchMachines();
    }
  }, [clientId]);

  const columns = [
    {
      accessorKey: 'serial_number',
      header: 'Número de Série',
    },
    {
      accessorKey: 'model',
      header: 'Modelo',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
  ];

  const filteredMachines = machines.filter(machine =>
    machine.serial_number.toLowerCase().includes(search.toLowerCase()) ||
    machine.model.toLowerCase().includes(search.toLowerCase())
  );

  const machinesPath = PATHS.CLIENT.MACHINES || "/clients/machines";

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Máquinas</h1>
          <p className="text-muted-foreground">Gerencie suas máquinas</p>
        </div>

        <div className="flex items-center mt-4 sm:mt-0 space-x-2">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Máquina
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Minhas Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="search"
            placeholder="Pesquisar máquinas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md mb-4"
          />
          <DataTable columns={columns} data={filteredMachines} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Machines;
