
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
import { Search } from "lucide-react";
import { PATHS } from "@/routes/paths";

const LogisticsMachines = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Máquinas" 
        description="Gerencie o estoque e instalações de máquinas"
        actionLabel="Cadastrar Máquina"
        actionLink={PATHS.LOGISTICS.MACHINE_NEW}
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
              <SelectItem value="stock">Em Estoque</SelectItem>
              <SelectItem value="installed">Instalada</SelectItem>
              <SelectItem value="maintenance">Em Manutenção</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Modelos</SelectItem>
              <SelectItem value="pro">Terminal Pro</SelectItem>
              <SelectItem value="standard">Terminal Standard</SelectItem>
              <SelectItem value="mini">Terminal Mini</SelectItem>
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
              <TableHead>Status</TableHead>
              <TableHead>Local Atual</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead className="w-[150px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { serial: "SN-100001", model: "Terminal Pro", status: "Instalada", location: "Cliente ABC", lastUpdate: "22/04/2025" },
              { serial: "SN-100002", model: "Terminal Standard", status: "Em Manutenção", location: "Centro Técnico", lastUpdate: "21/04/2025" },
              { serial: "SN-100003", model: "Terminal Pro", status: "Em Estoque", location: "Depósito Central", lastUpdate: "20/04/2025" },
              { serial: "SN-100004", model: "Terminal Mini", status: "Em Estoque", location: "Depósito Central", lastUpdate: "20/04/2025" },
              { serial: "SN-100005", model: "Terminal Standard", status: "Instalada", location: "Cliente XYZ", lastUpdate: "19/04/2025" },
              { serial: "SN-100006", model: "Terminal Pro", status: "Em Estoque", location: "Depósito Central", lastUpdate: "18/04/2025" },
              { serial: "SN-100007", model: "Terminal Standard", status: "Em Manutenção", location: "Centro Técnico", lastUpdate: "17/04/2025" },
            ].map((machine, i) => (
              <TableRow key={i}>
                <TableCell>{machine.serial}</TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    machine.status === "Instalada" ? "bg-green-50 text-green-700" : 
                    machine.status === "Em Manutenção" ? "bg-yellow-50 text-yellow-700" : 
                    "bg-blue-50 text-blue-700"
                  }`}>
                    {machine.status}
                  </span>
                </TableCell>
                <TableCell>{machine.location}</TableCell>
                <TableCell>{machine.lastUpdate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Mover</Button>
                    <Button variant="ghost" size="sm">Detalhes</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageWrapper>
    </div>
  );
};

export default LogisticsMachines;
