
import React from "react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";

const Fees = () => {
  // Sample fee data
  const feeData = [
    { id: 1, type: "Credit Card", percentage: "2.5%", fixed_amount: "R$ 0.50" },
    { id: 2, type: "Debit Card", percentage: "1.8%", fixed_amount: "R$ 0.30" },
    { id: 3, type: "PIX", percentage: "1.0%", fixed_amount: "R$ 0.00" },
  ];

  const columns = [
    {
      id: "type",
      header: "Tipo de Pagamento",
      accessorKey: "type",
    },
    {
      id: "percentage",
      header: "Taxa Percentual",
      accessorKey: "percentage",
    },
    {
      id: "fixed_amount",
      header: "Valor Fixo",
      accessorKey: "fixed_amount",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Taxas de Processamento</h1>
        <p className="text-muted-foreground">
          Configurações das taxas de processamento para diferentes métodos de pagamento.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Taxas Atuais</h2>
        <DataTable columns={columns} data={feeData} />
      </Card>
    </div>
  );
};

export default Fees;
