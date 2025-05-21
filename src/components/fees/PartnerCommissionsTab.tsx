
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

const PartnerCommissionsTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Comissões de Parceiros</h3>
          <Button>Adicionar Nova Comissão</Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo de Parceiro</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Condições</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Comissão Base", type: "Todos", value: "5%", conditions: "Todas vendas", status: "Ativo" },
              { name: "Comissão Premium", type: "Premium", value: "8%", conditions: "Vendas > R$10.000", status: "Ativo" },
              { name: "Comissão Loja", type: "Loja", value: "10%", conditions: "Primeira venda", status: "Ativo" },
              { name: "Comissão Recorrente", type: "Todos", value: "2%", conditions: "Mensalidades", status: "Ativo" },
            ].map((commission, i) => (
              <TableRow key={i}>
                <TableCell>{commission.name}</TableCell>
                <TableCell>{commission.type}</TableCell>
                <TableCell>{commission.value}</TableCell>
                <TableCell>{commission.conditions}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                    {commission.status}
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

export default PartnerCommissionsTab;
