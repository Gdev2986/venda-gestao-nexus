import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MachinesClientsTab = () => {
  // Mock data for machines by client (keeping the same data from original file)
  const clientMachines = [
    {
      clientName: "Supermercado ABC",
      machines: [
        { serial: "SN-100001", model: "Terminal Pro", status: "Ativa", establishment: "Loja Central" },
        { serial: "SN-100005", model: "Terminal Standard", status: "Ativa", establishment: "Loja Filial" }
      ]
    },
    {
      clientName: "Farmácia Saúde",
      machines: [
        { serial: "SN-100010", model: "Terminal Mini", status: "Ativa", establishment: "Matriz" }
      ]
    },
  ];

  return (
    <div className="space-y-6">
      {clientMachines.map((client, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>{client.clientName}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Estabelecimento</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.machines.map((machine, i) => (
                  <TableRow key={i}>
                    <TableCell>{machine.serial}</TableCell>
                    <TableCell>{machine.model}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                        {machine.status}
                      </span>
                    </TableCell>
                    <TableCell>{machine.establishment}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Transferir
                        </Button>
                        <Button variant="ghost" size="sm">
                          Histórico
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MachinesClientsTab;
