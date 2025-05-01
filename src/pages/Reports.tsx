
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Reports = () => {
  const [reportType, setReportType] = useState("sales");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Gere e visualize relatórios de diferentes aspectos do negócio.
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-64">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Relatório de Vendas</SelectItem>
                <SelectItem value="clients">Relatório de Clientes</SelectItem>
                <SelectItem value="partners">Relatório de Parceiros</SelectItem>
                <SelectItem value="machines">Relatório de Máquinas</SelectItem>
                <SelectItem value="finances">Relatório Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>Gerar Relatório</Button>
        </div>

        <div className="p-4 border rounded-md bg-muted/20 text-center">
          <p>Selecione um tipo de relatório e clique em "Gerar Relatório" para visualizar.</p>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
