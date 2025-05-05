
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
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PATHS } from "@/routes/paths";
import { Search } from "lucide-react";

const AdminPayments = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pagamentos" 
        description="Gerencie solicitações de pagamento e transações"
        actionLabel="Novo Pagamento"
        actionLink={PATHS.ADMIN.PAYMENT_NEW}
      />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pagamentos..."
            className="pl-8 bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="approved">Aprovados</SelectItem>
              <SelectItem value="rejected">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Filtrar</Button>
        </div>
      </div>
      
      <PageWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>#{10000 + i}</TableCell>
                <TableCell>{i % 2 === 0 ? `Cliente ${i}` : `Parceiro ${i}`}</TableCell>
                <TableCell>{i % 3 === 0 ? "Comissão" : "Reembolso"}</TableCell>
                <TableCell>R$ {(Math.random() * 3000).toFixed(2)}</TableCell>
                <TableCell>{`${10 + i}/04/2025`}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                    ${i % 3 === 0 ? "bg-yellow-50 text-yellow-700" : 
                      i % 2 === 0 ? "bg-green-50 text-green-700" : 
                      "bg-red-50 text-red-700"}`}>
                    {i % 3 === 0 ? "Pendente" : i % 2 === 0 ? "Aprovado" : "Rejeitado"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={PATHS.ADMIN.PAYMENT_DETAILS(String(i))}>Detalhes</a>
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

export default AdminPayments;
