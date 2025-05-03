
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

const AdminPartners = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Parceiros" 
        description="Gerencie os parceiros e consultores do sistema"
        actionLabel="Adicionar Parceiro"
        actionLink={PATHS.ADMIN.PARTNER_NEW}
      />

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar parceiros..."
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
              <TableHead>Tipo</TableHead>
              <TableHead>Clientes</TableHead>
              <TableHead>Comissão Pendente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>Parceiro {i}</TableCell>
                <TableCell>{i % 2 === 0 ? "Consultor" : "Loja"}</TableCell>
                <TableCell>{i * 5}</TableCell>
                <TableCell>R$ {(Math.random() * 5000).toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                    ${i % 3 !== 0 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                    {i % 3 !== 0 ? "Ativo" : "Pendente"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={PATHS.ADMIN.PARTNER_DETAILS(String(i))}>Detalhes</a>
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

export default AdminPartners;
