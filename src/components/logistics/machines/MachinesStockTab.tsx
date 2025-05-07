import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MachinesStockTab = () => {
  // Mock data for machines in stock (keeping the same data from original file)
  const stockMachines = [
    { serial: "SN-100003", model: "Terminal Pro", status: "Novo", location: "Depósito Central", arrivalDate: "15/04/2025" },
    { serial: "SN-100004", model: "Terminal Mini", status: "Novo", location: "Depósito Central", arrivalDate: "15/04/2025" },
    { serial: "SN-100006", model: "Terminal Pro", status: "Revisado", location: "Depósito Central", arrivalDate: "10/04/2025" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Máquinas em Estoque</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Gerar Relatório
          </Button>
          <Button size="sm">
            Entrada no Estoque
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Data de Entrada</TableHead>
                <TableHead className="w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockMachines.map((machine, i) => (
                <TableRow key={i}>
                  <TableCell>{machine.serial}</TableCell>
                  <TableCell>{machine.model}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      machine.status === "Novo" ? "bg-green-50 text-green-700" : 
                      "bg-blue-50 text-blue-700"
                    }`}>
                      {machine.status}
                    </span>
                  </TableCell>
                  <TableCell>{machine.location}</TableCell>
                  <TableCell>{machine.arrivalDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Associar
                      </Button>
                      <Button variant="ghost" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MachinesStockTab;
