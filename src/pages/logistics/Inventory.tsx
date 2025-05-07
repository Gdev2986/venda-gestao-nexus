
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
  TableRow,
} from "@/components/ui/table";
import { Search, Box, RefreshCw, AlertTriangle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
  status: "available" | "low" | "unavailable";
  optimalStock: number;
  category: string;
  lastUpdated: string;
}

const LogisticsInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Máquina de Cartão A",
      quantity: 10,
      location: "Armazém Principal",
      status: "available",
      optimalStock: 15,
      category: "Equipamentos",
      lastUpdated: "2025-05-01"
    },
    {
      id: "2",
      name: "Bobina Térmica 80mm",
      quantity: 150,
      location: "Armazém Secundário",
      status: "available",
      optimalStock: 200,
      category: "Suprimentos",
      lastUpdated: "2025-05-03"
    },
    {
      id: "3",
      name: "Cabo de Alimentação",
      quantity: 50,
      location: "Estoque Técnico",
      status: "available",
      optimalStock: 60,
      category: "Acessórios",
      lastUpdated: "2025-05-02"
    },
    {
      id: "4",
      name: "Bateria para Máquina",
      quantity: 5,
      location: "Estoque Técnico",
      status: "low",
      optimalStock: 20,
      category: "Peças",
      lastUpdated: "2025-04-28"
    },
    {
      id: "5",
      name: "Modem 4G",
      quantity: 8,
      location: "Armazém Principal",
      status: "low",
      optimalStock: 25,
      category: "Equipamentos",
      lastUpdated: "2025-05-04"
    },
    {
      id: "6",
      name: "Pinos de Conexão",
      quantity: 0,
      location: "Estoque Técnico",
      status: "unavailable",
      optimalStock: 30,
      category: "Peças",
      lastUpdated: "2025-04-15"
    }
  ]);
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(inventory.map(item => item.category)));

  // Calculate inventory statistics
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.status === "low").length;
  const outOfStockItems = inventory.filter(item => item.status === "unavailable").length;
  
  // Calculate optimization percentage
  const optimizationScore = Math.round(
    (inventory.filter(item => item.quantity >= item.optimalStock * 0.8).length / inventory.length) * 100
  );

  const handleGenerateReport = () => {
    toast({
      title: "Relatório Gerado",
      description: "O relatório de inventário foi gerado e está disponível para download."
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Dados Atualizados",
      description: "As informações do inventário foram atualizadas."
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Inventário" 
        description="Gerencie o estoque de máquinas e equipamentos"
        actionLabel="Adicionar Item"
        actionOnClick={() => toast({
          title: "Função não implementada",
          description: "Esta funcionalidade ainda será implementada."
        })}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <span className="text-2xl font-bold">{totalItems}</span>
            <span className="text-sm text-muted-foreground">Itens em Estoque</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold">{lowStockItems}</span>
              {lowStockItems > 0 && <AlertTriangle className="ml-2 h-5 w-5 text-yellow-500" />}
            </div>
            <span className="text-sm text-muted-foreground">Itens com Estoque Baixo</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold">{outOfStockItems}</span>
              {outOfStockItems > 0 && <AlertTriangle className="ml-2 h-5 w-5 text-red-500" />}
            </div>
            <span className="text-sm text-muted-foreground">Itens em Falta</span>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar item no inventário..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleGenerateReport}>
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={categoryFilter} className="mt-0">
          <PageWrapper>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Status de Otimização de Estoque</span>
                <span className="text-sm font-medium">{optimizationScore}%</span>
              </div>
              <Progress value={optimizationScore} className="h-2" />
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Estoque Ideal</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.optimalStock}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === "available" 
                          ? "bg-green-50 text-green-700" 
                          : item.status === "low"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                      }`}>
                        {item.status === "available" ? "Disponível" : 
                         item.status === "low" ? "Estoque Baixo" : "Indisponível"}
                      </span>
                    </TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhum item encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsInventory;
