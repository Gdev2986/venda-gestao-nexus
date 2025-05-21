
import React, { useState } from "react";
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
import { Search, Package, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StyledCard } from "@/components/ui/styled-card";
import { motion } from "framer-motion";

interface MachineStockItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
  status: "available" | "unavailable";
}

const MachineStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<MachineStockItem[]>([
    {
      id: "1",
      name: "Máquina de Cartão A",
      quantity: 10,
      location: "Armazém Principal",
      status: "available",
    },
    {
      id: "2",
      name: "Bobina Térmica 80mm",
      quantity: 150,
      location: "Armazém Secundário",
      status: "available",
    },
    {
      id: "3",
      name: "Cabo de Alimentação",
      quantity: 50,
      location: "Estoque Técnico",
      status: "available",
    },
    {
      id: "4",
      name: "Bateria para Máquina",
      quantity: 5,
      location: "Estoque Técnico",
      status: "unavailable",
    },
  ]);
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Estoque de Máquinas" 
        description="Gerencie o estoque de máquinas e equipamentos"
        action={
          <Button onClick={() => toast({
            title: "Função não implementada",
            description: "Esta funcionalidade ainda será implementada."
          })}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StyledCard 
          title="Total de Itens" 
          icon={<Package className="h-4 w-4 text-blue-500" />}
          borderColor="border-blue-500"
        >
          <div className="text-2xl font-bold">{inventory.length}</div>
          <p className="text-sm text-muted-foreground">Itens em estoque</p>
        </StyledCard>
        
        <StyledCard 
          title="Disponíveis" 
          icon={<Package className="h-4 w-4 text-green-500" />}
          borderColor="border-green-500"
        >
          <div className="text-2xl font-bold">
            {inventory.filter(item => item.status === "available").length}
          </div>
          <p className="text-sm text-muted-foreground">Itens disponíveis</p>
        </StyledCard>
        
        <StyledCard 
          title="Indisponíveis" 
          icon={<Package className="h-4 w-4 text-orange-500" />}
          borderColor="border-orange-500"
        >
          <div className="text-2xl font-bold">
            {inventory.filter(item => item.status === "unavailable").length}
          </div>
          <p className="text-sm text-muted-foreground">Itens indisponíveis</p>
        </StyledCard>
        
        <StyledCard 
          title="Total de Quantidades" 
          icon={<Package className="h-4 w-4 text-purple-500" />}
          borderColor="border-purple-500"
        >
          <div className="text-2xl font-bold">
            {inventory.reduce((acc, item) => acc + item.quantity, 0)}
          </div>
          <p className="text-sm text-muted-foreground">Unidades totais</p>
        </StyledCard>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar item no inventário..."
          className="pl-8 bg-background"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <StyledCard borderColor="border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item, index) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}
              >
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    item.status === "available" 
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  }`}>
                    {item.status === "available" ? "Disponível" : "Indisponível"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </StyledCard>
    </div>
  );
};

export default MachineStock;
