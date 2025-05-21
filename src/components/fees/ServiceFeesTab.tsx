
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const ServiceFeesTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Taxas de Serviço</h3>
          <Button>Adicionar Nova Taxa</Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo de Serviço</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Taxa de Instalação", type: "Instalação", value: "R$ 150,00", description: "Por máquina", status: "Ativo" },
              { name: "Taxa de Manutenção", type: "Manutenção", value: "R$ 80,00", description: "Por visita", status: "Ativo" },
              { name: "Taxa de Bobina", type: "Material", value: "R$ 15,00", description: "Por bobina", status: "Ativo" },
              { name: "Taxa de Cancelamento", type: "Administrativo", value: "R$ 250,00", description: "Por contrato", status: "Ativo" },
            ].map((fee, i) => (
              <TableRow key={i}>
                <TableCell>{fee.name}</TableCell>
                <TableCell>{fee.type}</TableCell>
                <TableCell>{fee.value}</TableCell>
                <TableCell>{fee.description}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                    {fee.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ServiceFeesTab;
