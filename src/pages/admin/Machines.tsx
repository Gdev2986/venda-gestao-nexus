
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

const AdminMachines = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Máquinas" 
        description="Gerencie o estoque e instalações de máquinas"
        actionLabel="Cadastrar Máquina"
        actionLink={PATHS.ADMIN.MACHINE_NEW}
      />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por serial, modelo..."
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
              <SelectItem value="active">Instalada</SelectItem>
              <SelectItem value="maintenance">Em manutenção</SelectItem>
              <SelectItem value="stock">Em estoque</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Filtrar</Button>
        </div>
      </div>
      
      <PageWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>SN-{100000 + i}</TableCell>
                <TableCell>Terminal {i % 2 === 0 ? "Pro" : "Standard"}</TableCell>
                <TableCell>{i % 4 === 0 ? "Em estoque" : `Cliente ${i}`}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                    ${i % 4 === 0 ? "bg-blue-50 text-blue-700" : 
                      i % 3 === 0 ? "bg-yellow-50 text-yellow-700" : 
                      "bg-green-50 text-green-700"}`}>
                    {i % 4 === 0 ? "Em estoque" : i % 3 === 0 ? "Em manutenção" : "Instalada"}
                  </span>
                </TableCell>
                <TableCell>{`${10 + i}/04/2025`}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={PATHS.ADMIN.MACHINE_DETAILS(String(i))}>Detalhes</a>
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

export default AdminMachines;
