
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
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
        actionLabel="Adicionar Item"
        actionOnClick={() => toast({
          title: "Função não implementada",
          description: "Esta funcionalidade ainda será implementada."
        })}
      />
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar item no inventário..."
          className="pl-8 bg-background"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <PageWrapper>
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
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    item.status === "available" 
                      ? "bg-green-50 text-green-700" 
                      : "bg-red-50 text-red-700"
                  }`}>
                    {item.status === "available" ? "Disponível" : "Indisponível"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageWrapper>
    </div>
  );
};

export default MachineStock;
