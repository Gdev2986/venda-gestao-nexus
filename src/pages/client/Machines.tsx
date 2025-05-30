
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, MapPin, Calendar, Edit2, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: string;
  created_at: string;
  custom_name?: string;
  custom_location?: string;
}

const ClientMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMachine, setEditingMachine] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ custom_name: "", custom_location: "" });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchMachines();
    }
  }, [user?.id]);

  const fetchMachines = async () => {
    if (!user?.id) return;

    try {
      // Buscar client_id do usuário
      const { data: clientAccess } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (!clientAccess) {
        setIsLoading(false);
        return;
      }

      // Buscar máquinas do cliente
      const { data: machinesData, error: machinesError } = await supabase
        .from('machines')
        .select('id, serial_number, model, status, created_at')
        .eq('client_id', clientAccess.client_id)
        .order('created_at', { ascending: false });

      if (machinesError) throw machinesError;

      // Buscar customizações das máquinas
      const { data: customizations, error: customError } = await supabase
        .from('machine_customizations')
        .select('*')
        .eq('client_id', clientAccess.client_id);

      if (customError && customError.code !== 'PGRST116') {
        console.error('Error fetching customizations:', customError);
      }

      // Combinar dados das máquinas com customizações
      const machinesWithCustomization = (machinesData || []).map(machine => {
        const customization = customizations?.find(c => c.machine_id === machine.id);
        return {
          ...machine,
          custom_name: customization?.custom_name || '',
          custom_location: customization?.custom_location || ''
        };
      });

      setMachines(machinesWithCustomization);
    } catch (error) {
      console.error('Erro ao buscar máquinas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar suas máquinas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStart = (machine: Machine) => {
    setEditingMachine(machine.id);
    setEditForm({
      custom_name: machine.custom_name || machine.model,
      custom_location: machine.custom_location || ''
    });
  };

  const handleEditCancel = () => {
    setEditingMachine(null);
    setEditForm({ custom_name: "", custom_location: "" });
  };

  const handleEditSave = async (machineId: string) => {
    if (!user?.id) return;

    try {
      // Buscar client_id do usuário
      const { data: clientAccess } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (!clientAccess) throw new Error('Cliente não encontrado');

      // Salvar ou atualizar customização
      const { error } = await supabase
        .from('machine_customizations')
        .upsert({
          machine_id: machineId,
          client_id: clientAccess.client_id,
          custom_name: editForm.custom_name,
          custom_location: editForm.custom_location
        }, {
          onConflict: 'machine_id,client_id'
        });

      if (error) throw error;

      // Atualizar estado local
      setMachines(prev => prev.map(machine => 
        machine.id === machineId 
          ? { 
              ...machine, 
              custom_name: editForm.custom_name,
              custom_location: editForm.custom_location 
            }
          : machine
      ));

      setEditingMachine(null);
      toast({
        title: "Sucesso",
        description: "Informações da máquina atualizadas",
      });
    } catch (error) {
      console.error('Erro ao salvar customização:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar as informações",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativa</Badge>;
      case 'INACTIVE':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inativa</Badge>;
      case 'MAINTENANCE':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Manutenção</Badge>;
      case 'BLOCKED':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Bloqueada</Badge>;
      case 'STOCK':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Estoque</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDisplayName = (machine: Machine) => {
    return machine.custom_name || machine.model;
  };

  const getDisplayLocation = (machine: Machine) => {
    return machine.custom_location || 'Local não definido';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Minhas Máquinas"
          description="Visualize e gerencie suas máquinas de pagamento"
        />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Minhas Máquinas"
        description="Visualize e gerencie suas máquinas de pagamento"
      />
      
      {machines.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma máquina encontrada</h3>
            <p className="text-muted-foreground">
              Você não possui máquinas registradas no momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <Card 
              key={machine.id} 
              className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-blue-600" />
                    {editingMachine === machine.id ? (
                      <Input
                        value={editForm.custom_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, custom_name: e.target.value }))}
                        className="text-lg font-semibold"
                        placeholder="Nome da máquina"
                      />
                    ) : (
                      <span>{getDisplayName(machine)}</span>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(machine.status)}
                    {editingMachine === machine.id ? (
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEditSave(machine.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={handleEditCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditStart(machine)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>Modelo:</strong> {machine.model}
                </div>
                <div className="text-sm">
                  <strong>Serial:</strong> {machine.serial_number}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {editingMachine === machine.id ? (
                    <Input
                      value={editForm.custom_location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, custom_location: e.target.value }))}
                      placeholder="Local da máquina"
                      className="text-sm"
                    />
                  ) : (
                    <span>{getDisplayLocation(machine)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Instalada em {new Date(machine.created_at).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientMachines;
