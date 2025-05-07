
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const RequestsTable: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Solicitações Recentes</span>
          <Button variant="outline" size="sm">Ver Todas</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Empresa A</TableCell>
              <TableCell>Instalação</TableCell>
              <TableCell>15/05/2025</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                  Pendente
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Empresa B</TableCell>
              <TableCell>Manutenção</TableCell>
              <TableCell>16/05/2025</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                  Agendado
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Empresa C</TableCell>
              <TableCell>Retirada</TableCell>
              <TableCell>17/05/2025</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                  Concluído
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestsTable;
