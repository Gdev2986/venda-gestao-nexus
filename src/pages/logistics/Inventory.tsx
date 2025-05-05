
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Box, BarChart3, AlertTriangle, ArrowUp, ArrowDown, Plus, Calendar } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";

// Mock data for inventory items
const mockInventoryItems = [
  { 
    id: "INV-001", 
    name: "Terminal POS Pro", 
    category: "Máquinas", 
    quantity: 35, 
    minQuantity: 15, 
    price: 1200,
    location: "Depósito Central",
    status: "Em estoque"
  },
  { 
    id: "INV-002", 
    name: "Terminal POS Standard", 
    category: "Máquinas", 
    quantity: 48, 
    minQuantity: 20, 
    price: 980,
    location: "Depósito Central",
    status: "Em estoque"
  },
  { 
    id: "INV-003", 
    name: "Terminal POS Mini", 
    category: "Máquinas", 
    quantity: 12, 
    minQuantity: 10, 
    price: 750,
    location: "Depósito Central",
    status: "Em estoque"
  },
  { 
    id: "INV-004", 
    name: "Bobina Térmica 80mm", 
    category: "Suprimentos", 
    quantity: 240, 
    minQuantity: 100, 
    price: 4.5,
    location: "Depósito Central",
    status: "Em estoque"
  },
  { 
    id: "INV-005", 
    name: "Bobina Térmica 57mm", 
    category: "Suprimentos", 
    quantity: 180, 
    minQuantity: 80, 
    price: 3.2,
    location: "Depósito Central",
    status: "Em estoque"
  },
  { 
    id: "INV-006", 
    name: "Cabo de Alimentação", 
    category: "Acessórios", 
    quantity: 72, 
    minQuantity: 30, 
    price: 15,
    location: "Depósito Central",
    status: "Em estoque"
  },
  { 
    id: "INV-007", 
    name: "Cabo USB", 
    category: "Acessórios", 
    quantity: 56, 
    minQuantity: 25, 
    price: 12,
    location: "Depósito Central",
    status: "Em estoque"
  },
  { 
    id: "INV-008", 
    name: "Bateria Reserva", 
    category: "Peças", 
    quantity: 18, 
    minQuantity: 20, 
    price: 45,
    location: "Depósito Central",
    status: "Baixo estoque"
  },
  { 
    id: "INV-009", 
    name: "Placa de Comunicação 4G", 
    category: "Peças", 
    quantity: 25, 
    minQuantity: 10, 
    price: 120,
    location: "Depósito Central",
    status: "Em estoque"
  },
  { 
    id: "INV-010", 
    name: "Módulo de Impressão", 
    category: "Peças", 
    quantity: 6, 
    minQuantity: 8, 
    price: 180,
    location: "Depósito Central",
    status: "Baixo estoque"
  },
];

// Mock data for inventory movements
const mockMovements = [
  { 
    id: "MOV-001", 
    date: "22/04/2025", 
    type: "Entrada", 
    item: "Terminal POS Pro", 
    quantity: 15, 
    origin: "Fornecedor XYZ",
    destination: "Depósito Central",
    responsible: "Ana Silva"
  },
  { 
    id: "MOV-002", 
    date: "21/04/2025", 
    type: "Saída", 
    item: "Terminal POS Standard", 
    quantity: 2, 
    origin: "Depósito Central",
    destination: "Cliente ABC",
    responsible: "Carlos Santos"
  },
  { 
    id: "MOV-003", 
    date: "20/04/2025", 
    type: "Saída", 
    item: "Bobina Térmica 80mm", 
    quantity: 20, 
    origin: "Depósito Central",
    destination: "Centro Técnico",
    responsible: "Marcos Oliveira"
  },
  { 
    id: "MOV-004", 
    date: "19/04/2025", 
    type: "Transferência", 
    item: "Terminal POS Mini", 
    quantity: 5, 
    origin: "Depósito Central",
    destination: "Escritório Regional",
    responsible: "Carla Rodrigues"
  },
  { 
    id: "MOV-005", 
    date: "18/04/2025", 
    type: "Entrada", 
    item: "Cabo de Alimentação", 
    quantity: 30, 
    origin: "Fornecedor ABC",
    destination: "Depósito Central",
    responsible: "Ana Silva"
  },
];

// Mock data for chart
const inventoryChartData = [
  { name: 'Jan', entrances: 45, exits: 32 },
  { name: 'Fev', entrances: 38, exits: 29 },
  { name: 'Mar', entrances: 52, exits: 48 },
  { name: 'Abr', entrances: 40, exits: 36 },
  { name: 'Mai', entrances: 35, exits: 40 },
  { name: 'Jun', entrances: 48, exits: 42 },
  { name: 'Jul', entrances: 42, exits: 38 },
];

const LogisticsInventory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isAddMovementDialogOpen, setIsAddMovementDialogOpen] = useState(false);
  
  // Calculate total items
  const totalItems = mockInventoryItems.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate low stock items
  const lowStockItems = mockInventoryItems.filter(item => item.quantity < item.minQuantity).length;
  
  // Calculate total inventory value
  const totalValue = mockInventoryItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  
  // Filter inventory items
  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();
    
    const matchesStatus = 
      statusFilter === "all" ||
      item.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventário"
        description="Gerencie o estoque de máquinas, peças e suprimentos"
        actionLabel="Adicionar Item"
        actionOnClick={() => setIsAddItemDialogOpen(true)}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Itens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Box className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockInventoryItems.length} tipos de itens diferentes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Baixo Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{lowStockItems}</div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStockItems} itens abaixo do nível mínimo
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total em Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor atualizado em 23/04/2025
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Movimentações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {mockMovements.length}
              </div>
              <div className="flex space-x-1">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <ArrowDown className="h-5 w-5 text-blue-600" />
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <ArrowUp className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nos últimos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="inventory">
        <TabsList className="mb-6">
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, ID ou categoria..."
                className="pl-8 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="máquinas">Máquinas</SelectItem>
                  <SelectItem value="suprimentos">Suprimentos</SelectItem>
                  <SelectItem value="acessórios">Acessórios</SelectItem>
                  <SelectItem value="peças">Peças</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="em estoque">Em Estoque</SelectItem>
                  <SelectItem value="baixo estoque">Baixo Estoque</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">Filtrar</Button>
            </div>
          </div>
          
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Nível Mínimo</TableHead>
                  <TableHead>Preço Unit.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.minQuantity}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === "Em estoque" ? "bg-green-50 text-green-700" : 
                        "bg-yellow-50 text-yellow-700"
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsAddMovementDialogOpen(true)}
                        >
                          Movimentar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                        >
                          Detalhes
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="movements">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Histórico de Movimentações</h2>
            <Button onClick={() => setIsAddMovementDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Movimentação
            </Button>
          </div>
          
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMovements.map((movement, i) => (
                  <TableRow key={i}>
                    <TableCell>{movement.id}</TableCell>
                    <TableCell>{movement.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        movement.type === "Entrada" ? "bg-green-50 text-green-700" : 
                        movement.type === "Saída" ? "bg-orange-50 text-orange-700" : 
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {movement.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{movement.item}</TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>{movement.origin}</TableCell>
                    <TableCell>{movement.destination}</TableCell>
                    <TableCell>{movement.responsible}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Movimentações Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="entrances" name="Entradas" fill="#4ade80" />
                    <Bar dataKey="exits" name="Saídas" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Itens de Baixo Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Mínimo</TableHead>
                      <TableHead>Situação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInventoryItems
                      .filter(item => item.quantity < item.minQuantity)
                      .map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.minQuantity}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                              {Math.round((item.quantity / item.minQuantity) * 100)}% do mínimo
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                
                {mockInventoryItems.filter(item => item.quantity < item.minQuantity).length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40">
                    <CheckCircle className="h-10 w-10 text-green-600 mb-2" />
                    <p className="text-muted-foreground">Não há itens com estoque baixo</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Categorias de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Máquinas", value: 95, fill: "#4ade80" },
                          { name: "Suprimentos", value: 420, fill: "#f97316" },
                          { name: "Acessórios", value: 128, fill: "#3b82f6" },
                          { name: "Peças", value: 49, fill: "#8b5cf6" }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Item</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo item para adicionar ao inventário
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Item</label>
              <Input placeholder="Ex: Terminal POS Pro" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maquinas">Máquinas</SelectItem>
                  <SelectItem value="suprimentos">Suprimentos</SelectItem>
                  <SelectItem value="acessorios">Acessórios</SelectItem>
                  <SelectItem value="pecas">Peças</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantidade Inicial</label>
                <Input type="number" placeholder="0" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nível Mínimo</label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Preço Unitário (R$)</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Local de Armazenamento</label>
              <Select defaultValue="deposito">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposito">Depósito Central</SelectItem>
                  <SelectItem value="escritorio">Escritório Regional</SelectItem>
                  <SelectItem value="tecnico">Centro Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({
                title: "Item adicionado",
                description: "O item foi adicionado ao inventário com sucesso"
              });
              setIsAddItemDialogOpen(false);
            }}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Movement Dialog */}
      <Dialog open={isAddMovementDialogOpen} onOpenChange={setIsAddMovementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Movimentação</DialogTitle>
            <DialogDescription>
              Registre entrada, saída ou transferência de itens
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Movimentação</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Item</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o item" />
                </SelectTrigger>
                <SelectContent>
                  {mockInventoryItems.map((item, i) => (
                    <SelectItem key={i} value={item.id}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantidade</label>
              <Input type="number" placeholder="0" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data</label>
                <Input type="date" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Responsável</label>
                <Input placeholder="Nome do responsável" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Origem</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposito">Depósito Central</SelectItem>
                  <SelectItem value="fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="escritorio">Escritório Regional</SelectItem>
                  <SelectItem value="tecnico">Centro Técnico</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Destino</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposito">Depósito Central</SelectItem>
                  <SelectItem value="escritorio">Escritório Regional</SelectItem>
                  <SelectItem value="tecnico">Centro Técnico</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
              <Input placeholder="Adicione informações adicionais" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMovementDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({
                title: "Movimentação registrada",
                description: "A movimentação foi registrada com sucesso"
              });
              setIsAddMovementDialogOpen(false);
            }}>
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogisticsInventory;
