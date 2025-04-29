
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

// Define mock payment data structure
const mockPayments = [
  {
    id: "1",
    client_id: "1",
    client_name: "Empresa ABC",
    amount: 1500,
    status: "pending",
    created_at: "2023-05-15",
    pix_key_id: "123",
    pix_key: "email@empresa.com",
    pix_key_type: "email",
    is_boleto: false
  },
  {
    id: "2",
    client_id: "2",
    client_name: "Empresa XYZ",
    amount: 3200,
    status: "approved",
    created_at: "2023-05-10",
    approved_at: "2023-05-11",
    pix_key_id: "456",
    pix_key: "11999999999",
    pix_key_type: "phone",
    is_boleto: false
  },
  {
    id: "3",
    client_id: "1",
    client_name: "Empresa ABC",
    amount: 2000,
    status: "pending",
    created_at: "2023-05-18",
    pix_key_id: "123",
    pix_key: "email@empresa.com",
    pix_key_type: "email",
    is_boleto: true
  }
];

const statusColors = {
  pending: "bg-amber-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
};

const Payments = () => {
  // Move the useState hook inside the component function
  const [payments, setPayments] = useState(mockPayments);
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Pagamentos</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pagamentos</CardTitle>
            <CardDescription>
              Todos os pagamentos realizados no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.client_name}</TableCell>
                    <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{payment.created_at}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[payment.status]}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.is_boleto ? "Boleto" : "PIX"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Payments;
