import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MachineData } from "@/types";

// Sample machine data
const sampleMachines: MachineData[] = [
  {
    id: "1",
    name: "Terminal POS A10",
    serial_number: "SN12345678",
    model: "A10",
    status: "available",
    created_at: "2023-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "Terminal POS B20",
    serial_number: "SN23456789",
    model: "B20",
    status: "allocated",
    created_at: "2023-02-20T14:15:00Z"
  },
  {
    id: "3",
    name: "Terminal POS A10",
    serial_number: "SN34567890",
    model: "A10",
    status: "maintenance",
    created_at: "2023-03-05T09:45:00Z"
  },
  {
    id: "4",
    name: "Terminal POS C30",
    serial_number: "SN45678901",
    model: "C30",
    status: "available",
    created_at: "2023-04-10T16:20:00Z"
  },
  {
    id: "5",
    name: "Terminal POS B20",
    serial_number: "SN56789012",
    model: "B20",
    status: "defective",
    created_at: "2023-05-22T11:10:00Z"
  }
];

// Form schema for adding/editing machines
const machineFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  serial_number: z.string().min(5, {
    message: "Número de série deve ter pelo menos 5 caracteres.",
  }),
  model: z.string().min(1, {
    message: "Modelo é obrigatório.",
  }),
  status: z.enum(["available", "allocated", "maintenance", "defective"], {
    required_error: "Status é obrigatório.",
  }),
});

type MachineFormValues = z.infer<typeof machineFormSchema>;

const MachineStock = () => {
  const [machines, setMachines] = useState<MachineData[]>(sampleMachines);
  const [filteredMachines, setFilteredMachines] = useState<MachineData[]>(sampleMachines);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null);
  const { toast } = useToast();

  // Form for adding new machines
  const form = useForm<MachineFormValues>({
    resolver: zodResolver(machineFormSchema),
    defaultValues: {
      name: "",
      serial_number: "",
      model: "",
      status: "available",
    },
  });

  // Form for editing machines
  const editForm = useForm<MachineFormValues>({
    resolver: zodResolver(machineFormSchema),
    defaultValues: {
      name: selectedMachine?.name || "",
      serial_number: selectedMachine?.serial_number || "",
      model: selectedMachine?.model || "",
      status: (selectedMachine?.status as "available" | "allocated" | "maintenance" | "defective") || "available",
    },
  });

  // Reset edit form when selected machine changes
  React.useEffect(() => {
    if (selectedMachine) {
      editForm.reset({
        name: selectedMachine.name,
        serial_number: selectedMachine.serial_number,
        model: selectedMachine.model,
        status: selectedMachine.status as "available" | "allocated" | "maintenance" | "defective",
      });
    }
  }, [selectedMachine, editForm]);

  // Filter machines based on search term and filters
  const filterMachines = () => {
    let filtered = [...machines];
    
    if (searchTerm) {
      filtered = filtered.filter(
        machine => 
          machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(machine => machine.status === statusFilter);
    }
    
    if (modelFilter !== "all") {
      filtered = filtered.filter(machine => machine.model === modelFilter);
    }
    
    setFilteredMachines(filtered);
  };

  // Apply filters when dependencies change
  React.useEffect(() => {
    filterMachines();
  }, [searchTerm, statusFilter, modelFilter, machines]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle adding a new machine
  const onAddMachine = (data: MachineFormValues) => {
    const newMachine: MachineData = {
      id: `${machines.length + 1}`,
      name: data.name,
      serial_number: data.serial_number,
      model: data.model,
      status: data.status,
      created_at: new Date().toISOString(),
    };
    
    setMachines([...machines, newMachine]);
    setIsAddDialogOpen(false);
    form.reset();
    
    toast({
      title: "Máquina adicionada",
      description: "A máquina foi adicionada com sucesso ao estoque.",
    });
  };

  // Handle editing a machine
  const onEditMachine = (data: MachineFormValues) => {
    if (!selectedMachine) return;
    
    const updatedMachines = machines.map(machine => 
      machine.id === selectedMachine.id 
        ? { ...machine, ...data }
        : machine
    );
    
    setMachines(updatedMachines);
    setIsEditDialogOpen(false);
    setSelectedMachine(null);
    
    toast({
      title: "Máquina atualizada",
      description: "Os dados da máquina foram atualizados com sucesso.",
    });
  };

  // Get unique models for filter dropdown
  const uniqueModels = Array.from(new Set(machines.map(machine => machine.model)));

  // Get status label based on status code
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Disponível";
      case "allocated":
        return "Alocada";
      case "maintenance":
        return "Em Manutenção";
      case "defective":
        return "Defeituosa";
      default:
        return status;
    }
  };

  // Get status badge color based on status code
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "allocated":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "defective":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Estoque de Máquinas" 
        description="Gerencie o estoque de máquinas disponíveis"
        actionLabel="Adicionar Máquina"
        actionOnClick={() => setIsAddDialogOpen(true)}
      />
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, número de série ou modelo..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="available">Disponível</SelectItem>
            <SelectItem value="allocated">Alocada</SelectItem>
            <SelectItem value="maintenance">Em Manutenção</SelectItem>
            <SelectItem value="defective">Defeituosa</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={modelFilter} onValueChange={setModelFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por modelo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os modelos</SelectItem>
            {uniqueModels.map(model => (
              <SelectItem key={model} value={model}>{model}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Máquinas em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Número de Série</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Nenhuma máquina encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.name}</TableCell>
                    <TableCell>{machine.serial_number}</TableCell>
                    <TableCell>{machine.model}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(machine.status)}`}>
                        {getStatusLabel(machine.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedMachine(machine);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Machine Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Máquina</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da nova máquina a ser adicionada ao estoque.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddMachine)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Terminal POS A10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Série</FormLabel>
                    <FormControl>
                      <Input placeholder="SN12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="A10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Disponível</SelectItem>
                        <SelectItem value="allocated">Alocada</SelectItem>
                        <SelectItem value="maintenance">Em Manutenção</SelectItem>
                        <SelectItem value="defective">Defeituosa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Machine Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Máquina</DialogTitle>
            <DialogDescription>
              Atualize os detalhes da máquina selecionada.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditMachine)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Série</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Disponível</SelectItem>
                        <SelectItem value="allocated">Alocada</SelectItem>
                        <SelectItem value="maintenance">Em Manutenção</SelectItem>
                        <SelectItem value="defective">Defeituosa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MachineStock;
