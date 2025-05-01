
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  FileText, 
  Plus, 
  Search, 
  Edit,
  Filter
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const SalesAdmin = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSaleDialogOpen, setIsAddSaleDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchSales();
  }, []);
  
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          clients:client_id (business_name),
          machines:machine_id (model, serial_number),
          partners:partner_id (company_name)
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({
        title: "Erro ao carregar vendas",
        description: "Não foi possível carregar as vendas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const columns = [
    {
      id: "code",
      header: "Código",
      accessorKey: "code",
    },
    {
      id: "date",
      header: "Data",
      accessorKey: "date",
      cell: (info) => format(new Date(info.getValue()), "dd/MM/yyyy"),
    },
    {
      id: "client",
      header: "Cliente",
      accessorKey: "clients.business_name",
      cell: (info) => info.getValue() || "Cliente não encontrado",
    },
    {
      id: "machine",
      header: "Máquina",
      accessorKey: "machines.serial_number",
      cell: (info) => info.getValue() || "Não especificada",
    },
    {
      id: "gross_amount",
      header: "Valor Bruto",
      accessorKey: "gross_amount",
      cell: (info) => `R$ ${Number(info.getValue()).toFixed(2)}`,
    },
    {
      id: "net_amount",
      header: "Valor Líquido",
      accessorKey: "net_amount",
      cell: (info) => `R$ ${Number(info.getValue()).toFixed(2)}`,
    },
    {
      id: "payment_method",
      header: "Método",
      accessorKey: "payment_method",
      cell: (info) => {
        const method = info.getValue();
        return (
          <Badge
            variant={
              method === "CREDIT" ? "default" : 
              method === "DEBIT" ? "secondary" : 
              method === "PIX" ? "outline" : 
              "outline"
            }
          >
            {method === "CREDIT" ? "Crédito" : 
             method === "DEBIT" ? "Débito" : 
             method === "PIX" ? "PIX" : 
             method}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: (info) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" /> Detalhes
          </Button>
        </div>
      ),
    },
  ];
  
  const filteredSales = sales.filter(sale => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sale.code.toLowerCase().includes(searchLower) ||
      (sale.clients?.business_name || "").toLowerCase().includes(searchLower) ||
      (sale.machines?.serial_number || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Vendas</h1>
          <p className="text-muted-foreground">
            Visualize, adicione e edite vendas de todos os clientes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddSaleDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nova Venda
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vendas..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Método de Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="credit">Crédito</SelectItem>
                <SelectItem value="debit">Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" /> Filtros
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredSales}
          currentPage={1}
          totalPages={1}
        />
      </Card>
      
      <Dialog open={isAddSaleDialogOpen} onOpenChange={setIsAddSaleDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Venda</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da venda abaixo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Código da Venda</label>
              <Input placeholder="Código da venda" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cliente</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client1">Cliente 1</SelectItem>
                    <SelectItem value="client2">Cliente 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Máquina</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a máquina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="machine1">Máquina 1</SelectItem>
                    <SelectItem value="machine2">Máquina 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor Bruto</label>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor Líquido</label>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Método de Pagamento</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREDIT">Crédito</SelectItem>
                  <SelectItem value="DEBIT">Débito</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSaleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button>
              Salvar Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesAdmin;
