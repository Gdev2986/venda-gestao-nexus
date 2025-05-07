
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const MachinesTable: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Resumo de Máquinas</span>
          <Button variant="outline" size="sm">Ver Todas</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Local</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>SN-100001</TableCell>
              <TableCell>Terminal Pro</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                  Operando
                </span>
              </TableCell>
              <TableCell>Cliente ABC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SN-100002</TableCell>
              <TableCell>Terminal Standard</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                  Em Manutenção
                </span>
              </TableCell>
              <TableCell>Centro Técnico</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SN-100003</TableCell>
              <TableCell>Terminal Pro</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                  Em Estoque
                </span>
              </TableCell>
              <TableCell>Depósito Central</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MachinesTable;
