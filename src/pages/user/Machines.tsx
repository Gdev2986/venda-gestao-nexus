import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const UserMachines = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Minhas Máquinas" 
        description="Gerencie suas máquinas e solicite assistência"
      />
      
      <div className="flex items-center justify-between mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as máquinas</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="maintenance">Em manutenção</SelectItem>
          </SelectContent>
        </Select>
        
        <Button>Solicitar Assistência</Button>
      </div>
      
      <PageWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Última Manutenção</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { serial: "SN-100001", model: "Terminal Pro", status: "Ativa", location: "Loja Principal", lastMaint: "10/03/2025" },
              { serial: "SN-100002", model: "Terminal Standard", status: "Ativa", location: "Loja Filial", lastMaint: "15/02/2025" },
              { serial: "SN-100003", model: "Terminal Pro", status: "Em manutenção", location: "Escritório", lastMaint: "22/04/2025" },
            ].map((machine, i) => (
              <TableRow key={i}>
                <TableCell>{machine.serial}</TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    machine.status === "Ativa" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                  }`}>
                    {machine.status}
                  </span>
                </TableCell>
                <TableCell>{machine.location}</TableCell>
                <TableCell>{machine.lastMaint}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Detalhes</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageWrapper>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assistência Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Se você precisar de suporte técnico ou manutenção, nosso time está a disposição para ajudar.
            </p>
            <Button asChild>
              <a href={PATHS.CLIENT.SUPPORT}>Solicitar Suporte</a>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Solicite bobinas de papel e outros materiais para suas máquinas.
            </p>
            <Button variant="outline">Solicitar Materiais</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserMachines;
