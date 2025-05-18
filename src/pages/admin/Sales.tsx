
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSalesContent from "@/components/admin/sales/AdminSalesContent";
import AdminSalesLayout from "@/components/admin/sales/AdminSalesLayout";
import AdminSalesFilters from "@/components/admin/sales/AdminSalesFilters";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SalesUploader from "@/components/sales/SalesUploader";
import { useToast } from "@/hooks/use-toast";

export interface SalesData {
  id: string;
  date: string;
  terminal: string;
  amount: number;
  status: string;
  client: string;
  paymentMethod: string;
}

const AdminSales = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleNewSale = () => {
    navigate("/admin/sales/new");
  };

  const handleImportSales = () => {
    setIsImportDialogOpen(true);
  };

  const handleFileProcessed = (file: File, recordCount: number) => {
    toast({
      title: "Importação concluída",
      description: `${recordCount} registros foram importados de ${file.name}`,
    });
    setIsImportDialogOpen(false);
  };

  return (
    <AdminSalesLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Vendas</CardTitle>
            <CardDescription>
              Gerencie todas as vendas do sistema
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleImportSales}>
              Importar
            </Button>
            <Button onClick={handleNewSale}>
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Venda
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AdminSalesFilters filters={filters} setFilters={setFilters} />
          <AdminSalesContent filters={filters} isLoading={isLoading} />
        </CardContent>
      </Card>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Vendas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-muted-foreground">
              Selecione um arquivo CSV para importar vendas. O arquivo deve conter as colunas: data, terminal, valor, método de pagamento e cliente.
            </p>
            <div className="flex justify-center py-8">
              <SalesUploader onFileProcessed={handleFileProcessed} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminSalesLayout>
  );
};

export default AdminSales;
