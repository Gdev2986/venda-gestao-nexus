import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Monitor, Building, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Machine, MachineStatus } from "@/types/machine.types";
import { MachineDetailsDialog } from "./MachineDetailsDialog";
import { CreateMachineDialog } from "./CreateMachineDialog";

interface MachineListProps {
  data: Machine[];
}

export const MachineList: React.FC<MachineListProps> = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMachines = async () => {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select(`
          *,
          client:clients(id, business_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert database data to proper Machine type
      const convertedMachines: Machine[] = (data || []).map(machine => ({
        ...machine,
        status: machine.status as MachineStatus
      }));
      
      setMachines(convertedMachines);
      setFilteredMachines(convertedMachines);
    } catch (error) {
      console.error('Error fetching machines:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar máquinas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();

    // Setup realtime subscription
    const channel = supabase
      .channel('machines-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'machines'
        },
        () => {
          fetchMachines();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const filtered = machines.filter(machine =>
      machine.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (machine.client?.business_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMachines(filtered);
  }, [searchTerm, machines]);

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800">Operando</Badge>;
      case MachineStatus.STOCK:
        return <Badge className="bg-blue-100 text-blue-800">Em Estoque</Badge>;
      case MachineStatus.MAINTENANCE:
        return <Badge className="bg-yellow-100 text-yellow-800">Em Manutenção</Badge>;
      case MachineStatus.INACTIVE:
        return <Badge className="bg-gray-100 text-gray-800">Inativa</Badge>;
      case MachineStatus.BLOCKED:
        return <Badge className="bg-red-100 text-red-800">Bloqueada</Badge>;
      case MachineStatus.TRANSIT:
        return <Badge className="bg-purple-100 text-purple-800">Em Trânsito</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleMachineClick = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsDetailsOpen(true);
  };

  const handleUpdate = () => {
    fetchMachines();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Máquinas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Máquinas</h2>
          <p className="text-muted-foreground">
            Gerencie e monitore todas as máquinas de pagamento
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Máquina
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número de série, modelo ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMachines.length === 0 ? (
            <div className="text-center py-8">
              <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "Nenhuma máquina encontrada" : "Nenhuma máquina cadastrada"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Tente ajustar os termos de busca."
                  : "Comece cadastrando sua primeira máquina de pagamento."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMachines.map((machine) => (
                <Card 
                  key={machine.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                  onClick={() => handleMachineClick(machine)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-blue-600" />
                        {machine.model}
                      </CardTitle>
                      {getStatusBadge(machine.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <strong>Serial:</strong> {machine.serial_number}
                    </div>
                    
                    {machine.client && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-3 w-3" />
                        {machine.client.business_name}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(machine.created_at || '').toLocaleDateString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MachineDetailsDialog
        machine={selectedMachine}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onUpdate={handleUpdate}
        mode="edit"
      />

      <CreateMachineDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleUpdate}
      />
    </div>
  );
};
