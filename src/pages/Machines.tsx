import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, PenIcon, TrashIcon } from "lucide-react";
import MachineForm from "@/components/machines/MachineForm";
import MachineTransferForm from "@/components/machines/MachineTransferForm";
import { Badge } from "@/components/ui/badge";

const Machines = () => {
  
  const [machines, setMachines] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchMachines();
    fetchClients();
  }, []);
  
  const fetchMachines = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('machines')
        .select(`
          id,
          serial_number,
          model,
          status,
          client_id,
          clients:client_id (
            business_name
          )
        `);
        
      if (error) {
        throw error;
      }
      
      setMachines(data || []);
    } catch (error) {
      console.error("Erro ao carregar máquinas:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar máquinas",
        description: "Não foi possível carregar a lista de máquinas.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, business_name');
        
      if (error) {
        throw error;
      }
      
      setClients(data || []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
      });
    }
  };
  
  const handleCreateClick = () => {
    setSelectedMachine(null);
    setShowCreateForm(true);
    setShowTransferForm(false);
  };
  
  const handleEditClick = (machine) => {
    setSelectedMachine(machine);
    setShowCreateForm(true);
    setShowTransferForm(false);
  };
  
  const handleTransferClick = (machine) => {
    setSelectedMachine(machine);
    setShowTransferForm(true);
    setShowCreateForm(false);
  };
  
  const handleFormClose = () => {
    setShowCreateForm(false);
    setShowTransferForm(false);
    setSelectedMachine(null);
    fetchMachines();
  };
  
  const handleMachineFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (selectedMachine) {
        // Update existing machine
        const { error } = await supabase
          .from('machines')
          .update({
            model: data.model,
            serial_number: data.serialNumber,
            status: data.status,
            client_id: data.clientId || null,
          })
          .eq('id', selectedMachine.id);

        if (error) {
          throw error;
        }
        
        toast({
          title: "Máquina atualizada",
          description: "A máquina foi atualizada com sucesso.",
        });
      } else {
        // Create new machine
        const { error } = await supabase
          .from('machines')
          .insert([{
            model: data.model,
            serial_number: data.serialNumber,
            status: data.status,
            client_id: data.clientId || null,
          }]);

        if (error) {
          throw error;
        }
        
        toast({
          title: "Máquina cadastrada",
          description: "A máquina foi cadastrada com sucesso.",
        });
      }
      handleFormClose();
    } catch (error) {
      console.error("Erro ao salvar máquina:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar máquina",
        description: "Ocorreu um erro ao salvar os dados da máquina.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTransferFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Create transfer record
      const { error: transferError } = await supabase
        .from('machine_transfers')
        .insert([{
          machine_id: data.machineId,
          from_client_id: selectedMachine?.client_id,
          to_client_id: data.toClientId,
          transfer_date: data.transferDate,
          created_by: 'system', // Replace with actual user ID when auth is implemented
        }]);
      
      if (transferError) {
        throw transferError;
      }
      
      // Update machine client
      const { error: machineError } = await supabase
        .from('machines')
        .update({
          client_id: data.toClientId
        })
        .eq('id', data.machineId);
      
      if (machineError) {
        throw machineError;
      }
      
      toast({
        title: "Transferência realizada",
        description: "A máquina foi transferida com sucesso.",
      });
      
      handleFormClose();
    } catch (error) {
      console.error("Erro ao transferir máquina:", error);
      toast({
        variant: "destructive",
        title: "Erro ao transferir máquina",
        description: "Ocorreu um erro ao transferir a máquina.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {
    
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'INACTIVE':
        return <Badge variant="outline">Inativa</Badge>;
      case 'MAINTENANCE':
        return <Badge className="bg-amber-500">Manutenção</Badge>;
      case 'BLOCKED':
        return <Badge className="bg-destructive">Bloqueada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Máquinas</h2>
          <Button onClick={handleCreateClick}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nova Máquina
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="active">Ativas</TabsTrigger>
            <TabsTrigger value="maintenance">Em Manutenção</TabsTrigger>
            <TabsTrigger value="blocked">Bloqueadas</TabsTrigger>
          </TabsList>
          
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Máquinas</CardTitle>
                <CardDescription>Listagem completa de máquinas cadastradas no sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center p-6">
                    <p>Carregando...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {machines.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                            Nenhuma máquina encontrada.
                          </TableCell>
                        </TableRow>
                      ) : (
                        machines.map((machine) => (
                          <TableRow key={machine.id}>
                            <TableCell className="font-medium">{machine.serial_number}</TableCell>
                            <TableCell>{machine.model}</TableCell>
                            <TableCell>{getStatusBadge(machine.status)}</TableCell>
                            <TableCell>{machine.clients?.business_name || "Não atribuída"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(machine)}>
                                  <PenIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleTransferClick(machine)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-arrow-right"
                                  >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                  </svg>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Máquinas Ativas</CardTitle>
                <CardDescription>Máquinas em operação normal.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {machines.filter(m => m.status === 'ACTIVE').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          Nenhuma máquina ativa encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      machines
                        .filter(machine => machine.status === 'ACTIVE')
                        .map((machine) => (
                          <TableRow key={machine.id}>
                            <TableCell className="font-medium">{machine.serial_number}</TableCell>
                            <TableCell>{machine.model}</TableCell>
                            <TableCell>{machine.clients?.business_name || "Não atribuída"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(machine)}>
                                  <PenIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleTransferClick(machine)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-arrow-right"
                                  >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                  </svg>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Máquinas em Manutenção</CardTitle>
                <CardDescription>Máquinas temporariamente indisponíveis para uso.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {machines.filter(m => m.status === 'MAINTENANCE').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          Nenhuma máquina em manutenção encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      machines
                        .filter(machine => machine.status === 'MAINTENANCE')
                        .map((machine) => (
                          <TableRow key={machine.id}>
                            <TableCell className="font-medium">{machine.serial_number}</TableCell>
                            <TableCell>{machine.model}</TableCell>
                            <TableCell>{machine.clients?.business_name || "Não atribuída"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(machine)}>
                                  <PenIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blocked">
            <Card>
              <CardHeader>
                <CardTitle>Máquinas Bloqueadas</CardTitle>
                <CardDescription>Máquinas sem permissão para operação.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {machines.filter(m => m.status === 'BLOCKED').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          Nenhuma máquina bloqueada encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      machines
                        .filter(machine => machine.status === 'BLOCKED')
                        .map((machine) => (
                          <TableRow key={machine.id}>
                            <TableCell className="font-medium">{machine.serial_number}</TableCell>
                            <TableCell>{machine.model}</TableCell>
                            <TableCell>{machine.clients?.business_name || "Não atribuída"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(machine)}>
                                  <PenIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Formulário de criação/edição */}
        {showCreateForm && (
          <MachineForm 
            isOpen={showCreateForm}
            onClose={handleFormClose}
            onSubmit={handleMachineFormSubmit}
            initialData={selectedMachine ? {
              id: selectedMachine.id,
              model: selectedMachine.model,
              serialNumber: selectedMachine.serial_number,
              status: selectedMachine.status,
              clientId: selectedMachine.client_id
            } : undefined}
            title={selectedMachine ? "Editar Máquina" : "Nova Máquina"}
            clients={clients}
          />
        )}
        
        {/* Formulário de transferência */}
        {showTransferForm && (
          <MachineTransferForm 
            isOpen={showTransferForm}
            onClose={handleFormClose}
            onSubmit={handleTransferFormSubmit}
            clients={clients}
            machines={machines.map(m => ({
              id: m.id,
              model: m.model,
              serialNumber: m.serial_number,
              clientId: m.client_id
            }))}
            currentClientId={selectedMachine?.client_id}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Machines;
