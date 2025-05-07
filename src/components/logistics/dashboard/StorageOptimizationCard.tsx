
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box, PackageOpen, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StorageItem {
  id: string;
  name: string;
  currentStock: number;
  optimalStock: number;
  category: string;
  status: 'optimal' | 'warning' | 'critical';
}

const StorageOptimizationCard: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();
  
  // Sample inventory data
  const inventoryItems: StorageItem[] = [
    { 
      id: "1", 
      name: "Máquinas de Cartão", 
      currentStock: 24, 
      optimalStock: 30, 
      category: "Equipamentos",
      status: 'warning'
    },
    { 
      id: "2", 
      name: "Bobinas Térmicas", 
      currentStock: 150, 
      optimalStock: 200, 
      category: "Suprimentos",
      status: 'optimal'
    },
    { 
      id: "3", 
      name: "Baterias Sobressalentes", 
      currentStock: 5, 
      optimalStock: 20, 
      category: "Peças",
      status: 'critical'
    },
    { 
      id: "4", 
      name: "Cabos USB", 
      currentStock: 35, 
      optimalStock: 50, 
      category: "Suprimentos",
      status: 'optimal'
    },
    { 
      id: "5", 
      name: "Modem 4G", 
      currentStock: 8, 
      optimalStock: 25, 
      category: "Equipamentos",
      status: 'critical'
    }
  ];

  // Filter inventory by category
  const filteredItems = categoryFilter === "all" 
    ? inventoryItems 
    : inventoryItems.filter(item => item.category === categoryFilter);

  // Get unique categories for the filter
  const categories = Array.from(new Set(inventoryItems.map(item => item.category)));
  
  // Calculate overall optimization score
  const getOptimizationScore = () => {
    const total = inventoryItems.length;
    const optimal = inventoryItems.filter(item => item.status === 'optimal').length;
    return Math.round((optimal / total) * 100);
  };

  const handleOptimize = () => {
    toast({
      title: "Otimização iniciada",
      description: "As recomendações de estoque serão geradas em breve."
    });
  };

  // Get badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'Adequado';
      case 'warning':
        return 'Atenção';
      case 'critical':
        return 'Crítico';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Otimização de Estoque</CardTitle>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          <div className="flex items-center justify-between mt-1">
            <span>Nível geral de otimização</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleOptimize}
              className="text-xs h-7"
            >
              Otimizar Estoque
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Score de otimização</span>
              <span className="text-sm font-medium">{getOptimizationScore()}%</span>
            </div>
            <Progress value={getOptimizationScore()} className="h-2" />
          </div>

          <div className="space-y-3 mt-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {item.category === 'Equipamentos' ? (
                    <PackageOpen className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Box className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.currentStock}/{item.optimalStock} unidades
                    </p>
                  </div>
                </div>
                <Badge className={getBadgeVariant(item.status)}>
                  {item.status === 'critical' && (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {getStatusLabel(item.status)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageOptimizationCard;
