
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { PATHS } from "@/routes/paths";

// Mock data for machines
const mockMachines = [
  { 
    serial: "SN-100001", 
    model: "Terminal Pro", 
    status: "Instalada", 
    location: "Cliente ABC", 
    establishment: "Loja Central",
    lastUpdate: "22/04/2025" 
  },
  { 
    serial: "SN-100002", 
    model: "Terminal Standard", 
    status: "Em Manutenção", 
    location: "Centro Técnico", 
    establishment: "N/A",
    lastUpdate: "21/04/2025" 
  },
  { 
    serial: "SN-100003", 
    model: "Terminal Pro", 
    status: "Em Estoque", 
    location: "Depósito Central", 
    establishment: "N/A",
    lastUpdate: "20/04/2025" 
  },
  { 
    serial: "SN-100004", 
    model: "Terminal Mini", 
    status: "Em Estoque", 
    location: "Depósito Central", 
    establishment: "N/A",
    lastUpdate: "20/04/2025" 
  },
  { 
    serial: "SN-100005", 
    model: "Terminal Standard", 
    status: "Instalada", 
    location: "Cliente XYZ", 
    establishment: "Matriz",
    lastUpdate: "19/04/2025" 
  },
  { 
    serial: "SN-100006", 
    model: "Terminal Pro", 
    status: "Em Estoque", 
    location: "Depósito Central", 
    establishment: "N/A",
    lastUpdate: "18/04/2025" 
  },
  { 
    serial: "SN-100007", 
    model: "Terminal Standard", 
    status: "Em Manutenção", 
    location: "Centro Técnico", 
    establishment: "N/A",
    lastUpdate: "17/04/2025" 
  },
];

const LogisticsMachines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  const filteredMachines = mockMachines.filter(machine => {
    // Apply search filter
    const matchesSearch = 
      machine.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.establishment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = 
      statusFilter === "all" || 
      machine.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Apply model filter
    const matchesModel = 
      modelFilter === "all" || 
      machine.model.toLowerCase().includes(modelFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesModel;
  });

  const handleTransferClick = (machine: any) => {
    setSelectedMachine(machine);
    setIsTransferDialogOpen(true);
  };

  const handleHistoryClick = (machine: any) => {
    setSelectedMachine(machine);
    setIsHistoryDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Máquinas" 
        description="Gerencie o estoque e instalações de máquinas"
        actionLabel="Cadastrar Máquina"
        actionLink={PATHS.LOGISTICS.MACHINE_NEW}
      />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por serial, modelo, cliente..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="em estoque">Em Estoque</SelectItem>
              <SelectItem value="instalada">Instalada</SelectItem>
              <SelectItem value="em manutenção">Em Manutenção</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={modelFilter} 
            onValueChange={setModelFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Modelos</SelectItem>
              <SelectItem value="pro">Terminal Pro</SelectItem>
              <SelectItem value="standard">Terminal Standard</SelectItem>
              <SelectItem value="mini">Terminal Mini</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Filtrar</Button>
        </div>
      </div>
      
      <PageWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Local Atual</TableHead>
              <TableHead>Estabelecimento</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead className="w-[150px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.map((machine, i) => (
              <TableRow key={i}>
                <TableCell>{machine.serial}</TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    machine.status === "Instalada" ? "bg-green-50 text-green-700" : 
                    machine.status === "Em Manutenção" ? "bg-yellow-50 text-yellow-700" : 
                    "bg-blue-50 text-blue-700"
                  }`}>
                    {machine.status}
                  </span>
                </TableCell>
                <TableCell>{machine.location}</TableCell>
                <TableCell>{machine.establishment}</TableCell>
                <TableCell>{machine.lastUpdate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTransferClick(machine)}
                      disabled={machine.status === "Em Manutenção"}
                    >
                      Transferir
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleHistoryClick(machine)}
                    >
                      Histórico
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageWrapper>

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transferir Máquina</DialogTitle>
            <DialogDescription>
              {selectedMachine && `Serial: ${selectedMachine.serial} - Atualmente em: ${selectedMachine.location}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Destino</label>
              <Select defaultValue="client">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="stock">Estoque</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">Mercado Central</SelectItem>
                  <SelectItem value="client2">Restaurante Sabores</SelectItem>
                  <SelectItem value="client3">Farmácia Saúde</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Estabelecimento</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estabelecimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est1">Matriz</SelectItem>
                  <SelectItem value="est2">Filial Centro</SelectItem>
                  <SelectItem value="est3">Filial Norte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data da Transferência</label>
              <Input type="date" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
              <Input placeholder="Adicione informações relevantes para esta transferência" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsTransferDialogOpen(false)}>
              Confirmar Transferência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Histórico da Máquina</DialogTitle>
            <DialogDescription>
              {selectedMachine && `Serial: ${selectedMachine.serial} - Modelo: ${selectedMachine.model}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>De</TableHead>
                  <TableHead>Para</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { date: "22/04/2025", event: "Instalação", from: "Estoque", to: "Cliente ABC", responsible: "João Silva" },
                  { date: "20/04/2025", event: "Chegada ao Estoque", from: "Fornecedor", to: "Estoque", responsible: "Maria Oliveira" },
                  { date: "19/04/2025", event: "Compra", from: "-", to: "Fornecedor", responsible: "Sistema" },
                ].map((record, i) => (
                  <TableRow key={i}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        record.event === "Instalação" ? "bg-green-50 text-green-700" : 
                        record.event === "Manutenção" ? "bg-yellow-50 text-yellow-700" : 
                        record.event === "Transferência" ? "bg-purple-50 text-purple-700" :
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {record.event}
                      </span>
                    </TableCell>
                    <TableCell>{record.from}</TableCell>
                    <TableCell>{record.to}</TableCell>
                    <TableCell>{record.responsible}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsHistoryDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogisticsMachines;
