
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter } from "lucide-react";

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
  const [payments, setPayments] = useState(mockPayments);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesType = typeFilter === "all" || 
      (typeFilter === "pix" && !payment.is_boleto) || 
      (typeFilter === "boleto" && payment.is_boleto);
    return matchesStatus && matchesType;
  });
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Pagamentos</h2>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Filtre os pagamentos por status e tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      Nenhum pagamento encontrado com os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Payments;
