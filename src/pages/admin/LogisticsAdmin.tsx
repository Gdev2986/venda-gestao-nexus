
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Truck,
  Box,
  Edit,
  ArrowRight,
  Clipboard,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LogisticsAdmin = () => {
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("machines");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === "machines") {
      fetchMachines();
    }
  }, [activeTab]);

  const fetchMachines = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('machines')
        .select(`
          *,
          clients:client_id (business_name)
        `);
      
      if (error) throw error;
      setMachines(data || []);
    } catch (error) {
      console.error("Error fetching machines:", error);
      toast({
        title: "Erro ao carregar máquinas",
        description: "Não foi possível carregar os dados das máquinas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const machineColumns = [
    {
      id: "serial_number",
      header: "Número Serial",
      accessorKey: "serial_number",
    },
    {
      id: "model",
      header: "Modelo",
      accessorKey: "model",
    },
    {
      id: "client",
      header: "Cliente",
      accessorKey: "clients.business_name",
      cell: (info) => info.getValue() || "Não alocada",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge
            variant={
              status === "ACTIVE" ? "default" : 
              status === "INACTIVE" ? "secondary" : 
              status === "MAINTENANCE" ? "outline" : 
              status === "BLOCKED" ? "destructive" : 
              "outline"
            }
          >
            {status === "ACTIVE" ? "Ativa" : 
             status === "INACTIVE" ? "Inativa" : 
             status === "MAINTENANCE" ? "Manutenção" : 
             status === "BLOCKED" ? "Bloqueada" : 
             status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: (info) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => setIsTransferDialogOpen(true)}>
            <ArrowRight className="h-4 w-4 mr-1" /> Transferir
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
        </div>
      ),
    },
  ];

  const deliveryRequestColumns = [
    {
      id: "request_id",
      header: "ID",
      accessorKey: "id",
    },
    {
      id: "client_name",
      header: "Cliente",
      accessorKey: "client_name",
    },
    {
      id: "request_type",
      header: "Tipo",
      accessorKey: "request_type",
      cell: (info) => {
        const type = info.getValue();
        return (
          <Badge
            variant={
              type === "NEW_MACHINE" ? "default" : 
              type === "MAINTENANCE" ? "secondary" : 
              "outline"
            }
          >
            {type === "NEW_MACHINE" ? "Nova Máquina" : 
             type === "MAINTENANCE" ? "Manutenção" : 
             type}
          </Badge>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <div className="flex items-center">
            {status === "PENDING" && <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />}
            {status === "SCHEDULED" && <Clipboard className="h-4 w-4 text-blue-500 mr-1" />}
            {status === "COMPLETED" && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
            {status === "CANCELLED" && <XCircle className="h-4 w-4 text-red-500 mr-1" />}
            <span>
              {status === "PENDING" ? "Pendente" : 
               status === "SCHEDULED" ? "Agendado" : 
               status === "COMPLETED" ? "Concluído" : 
               status === "CANCELLED" ? "Cancelado" : 
               status}
            </span>
          </div>
        );
      },
    },
    {
      id: "date",
      header: "Data",
      accessorKey: "date",
    },
    {
      id: "actions",
      header: "Ações",
      cell: () => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm">
            <Clipboard className="h-4 w-4 mr-1" /> Agendar
          </Button>
          <Button variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-1" /> Concluir
          </Button>
        </div>
      ),
    },
  ];

  // Sample data for delivery requests tab
  const deliveryRequests = [
    {
      id: "REQ-001",
      client_name: "Restaurante Bom Sabor",
      request_type: "NEW_MACHINE",
      status: "PENDING",
      date: "01/05/2023",
    },
    {
      id: "REQ-002",
      client_name: "Loja do Zé",
      request_type: "MAINTENANCE",
      status: "SCHEDULED",
      date: "03/05/2023",
    },
    {
      id: "REQ-003",
      client_name: "Boutique Paris",
      request_type: "NEW_MACHINE",
      status: "COMPLETED",
      date: "28/04/2023",
    },
    {
      id: "REQ-004",
      client_name: "Mercado Modelo",
      request_type: "MAINTENANCE",
      status: "CANCELLED",
      date: "25/04/2023",
    },
  ];

  const filteredMachines = machines.filter(machine =>
    machine.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (machine.clients?.business_name && machine.clients.business_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredDeliveryRequests = deliveryRequests.filter(request =>
    request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Logística</h1>
          <p className="text-muted-foreground">
            Gerencie máquinas, transferências e requisições de entrega.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Nova Máquina
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Box className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Máquinas</p>
            <p className="text-2xl font-bold">{machines.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Máquinas Ativas</p>
            <p className="text-2xl font-bold">
              {machines.filter(m => m.status === "ACTIVE").length}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Em Manutenção</p>
            <p className="text-2xl font-bold">
              {machines.filter(m => m.status === "MAINTENANCE").length}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Truck className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Entregas Pendentes</p>
            <p className="text-2xl font-bold">
              {deliveryRequests.filter(r => r.status === "PENDING").length}
            </p>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="machines">Máquinas</TabsTrigger>
          <TabsTrigger value="deliveries">Requisições de Entrega</TabsTrigger>
        </TabsList>
        
        <TabsContent value="machines">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por serial, modelo ou cliente..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <DataTable
              columns={machineColumns}
              data={filteredMachines}
              currentPage={1}
              totalPages={1}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="deliveries">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID ou cliente..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Nova Requisição
              </Button>
            </div>

            <DataTable
              columns={deliveryRequestColumns}
              data={filteredDeliveryRequests}
              currentPage={1}
              totalPages={1}
            />
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transferir Máquina</DialogTitle>
            <DialogDescription>
              Transferir máquina para outro cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente de Origem</label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Cliente atual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">Cliente Atual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente de Destino</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente de destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client2">Cliente 2</SelectItem>
                  <SelectItem value="client3">Cliente 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data de Transferência</label>
              <Input type="date" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancelar
            </Button>
            <Button>
              Confirmar Transferência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogisticsAdmin;
