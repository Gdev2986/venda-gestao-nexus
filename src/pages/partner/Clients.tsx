
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

const PartnerClients = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meus Clientes" 
        description="Gerencie os clientes que você indicou"
        actionLabel="Adicionar Cliente"
        actionLink="#"
      />

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-8 bg-background"
          />
        </div>
        <Button variant="outline">Filtrar</Button>
      </div>
      
      <PageWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Vendas</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Comissão Gerada</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Cliente ABC", date: "22/04/2025", sales: 3, value: "R$ 7.500,00", commission: "R$ 750,00" },
              { name: "Cliente XYZ", date: "15/04/2025", sales: 2, value: "R$ 4.200,00", commission: "R$ 420,00" },
              { name: "Cliente DEF", date: "08/04/2025", sales: 5, value: "R$ 12.800,00", commission: "R$ 1.280,00" },
              { name: "Cliente 123", date: "01/04/2025", sales: 1, value: "R$ 2.100,00", commission: "R$ 210,00" },
              { name: "Cliente GHI", date: "25/03/2025", sales: 4, value: "R$ 9.300,00", commission: "R$ 930,00" },
            ].map((client, i) => (
              <TableRow key={i}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.date}</TableCell>
                <TableCell>{client.sales}</TableCell>
                <TableCell>{client.value}</TableCell>
                <TableCell>{client.commission}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Detalhes</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageWrapper>
    </div>
  );
};

export default PartnerClients;
