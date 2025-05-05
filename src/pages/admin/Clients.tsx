
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PATHS } from "@/routes/paths";
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
import { Search } from "lucide-react";

const AdminClients = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Clientes" 
        description="Gerencie todos os clientes do sistema"
        actionLabel="Adicionar Cliente"
        actionLink={PATHS.ADMIN.CLIENT_NEW}
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
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>Cliente Exemplo {i}</TableCell>
                <TableCell>cliente{i}@exemplo.com</TableCell>
                <TableCell>(11) 9{i}999-9999</TableCell>
                <TableCell>São Paulo</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                    Ativo
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={PATHS.ADMIN.CLIENT_DETAILS(String(i))}>Detalhes</a>
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

export default AdminClients;
