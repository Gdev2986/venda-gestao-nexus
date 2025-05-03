
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
import { PATHS } from "@/routes/paths";
import { Search } from "lucide-react";

const AdminSales = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vendas" 
        description="Gerencie todas as vendas do sistema"
        actionLabel="Nova Venda"
        actionLink={PATHS.ADMIN.SALES_NEW}
      />
      
      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar vendas..."
            className="pl-8 bg-background"
          />
        </div>
        <Button variant="outline">Filtrar</Button>
      </div>

      <PageWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cliente</TableHead>
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
                <TableCell>Cliente Exemplo {i}</TableCell>
                <TableCell>R$ {(Math.random() * 10000).toFixed(2)}</TableCell>
                <TableCell>{`${10 + i}/04/2025`}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                    ${i % 3 === 0 ? "bg-yellow-50 text-yellow-700" : 
                      i % 2 === 0 ? "bg-green-50 text-green-700" : 
                      "bg-blue-50 text-blue-700"}`}>
                    {i % 3 === 0 ? "Pendente" : i % 2 === 0 ? "Concluída" : "Em progresso"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={PATHS.ADMIN.SALES_DETAILS(String(i))}>Detalhes</a>
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

export default AdminSales;
