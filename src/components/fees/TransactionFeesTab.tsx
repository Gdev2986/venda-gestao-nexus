
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FeeManager } from "@/components/admin/FeeManager";

const TransactionFeesTab = () => {
  const [showFeeManager, setShowFeeManager] = useState(false);
  
  // Mock clients data for FeeManager
  const mockClients = [
    { id: "1", name: "Cliente Premium" },
    { id: "2", name: "Cliente Padrão" },
    { id: "3", name: "Cliente Novo" },
  ];
  
  // Mock existing fees data for FeeManager
  const mockExistingFees = [
    { id: "1", name: "Taxa Crédito 1x", paymentMethod: "CREDIT", installments: "1", feePercentage: "2.99" },
    { id: "2", name: "Taxa Débito", paymentMethod: "DEBIT", installments: "1", feePercentage: "1.99" },
  ];

  return (
    <div className="space-y-4">
      {showFeeManager ? (
        <FeeManager 
          clients={mockClients} 
          existingFees={mockExistingFees} 
          onSave={async (values) => {
            console.log("Fee saved:", values);
            setShowFeeManager(false);
          }} 
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Taxas de Transação</h3>
              <Button onClick={() => setShowFeeManager(true)}>Adicionar Nova Taxa</Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo de Transação</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Aplica a</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Taxa Padrão", type: "Pagamento", value: "2.5%", applies: "Todas transações", status: "Ativo" },
                  { name: "Taxa Parcelamento", type: "Crédito", value: "3.5%", applies: "Parcelamentos", status: "Ativo" },
                  { name: "Taxa Antecipação", type: "Antecipação", value: "1.8%", applies: "Antecipações", status: "Ativo" },
                  { name: "Taxa Premium", type: "Pagamento", value: "1.9%", applies: "Clientes Premium", status: "Ativo" },
                ].map((fee, i) => (
                  <TableRow key={i}>
                    <TableCell>{fee.name}</TableCell>
                    <TableCell>{fee.type}</TableCell>
                    <TableCell>{fee.value}</TableCell>
                    <TableCell>{fee.applies}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                        {fee.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionFeesTab;
