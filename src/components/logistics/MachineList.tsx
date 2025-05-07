
import { useState } from "react";
import { useMachines } from "@/hooks/use-machines";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

const MachineList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { machines, isLoading, refreshMachines } = useMachines({
    searchTerm,
    statusFilter,
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      ACTIVE: { color: "bg-green-100 text-green-800", label: "Ativa" },
      MAINTENANCE: { color: "bg-orange-100 text-orange-800", label: "Manutenção" },
      INACTIVE: { color: "bg-red-100 text-red-800", label: "Inativa" },
      REPLACEMENT_REQUESTED: { color: "bg-blue-100 text-blue-800", label: "Troca Solicitada" },
    };

    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };

    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por serial, modelo ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ACTIVE">Ativas</SelectItem>
                <SelectItem value="MAINTENANCE">Em manutenção</SelectItem>
                <SelectItem value="INACTIVE">Inativas</SelectItem>
                <SelectItem value="REPLACEMENT_REQUESTED">Troca solicitada</SelectItem>
              </SelectContent>
            </Select>

            <Button asChild>
              <Link to={PATHS.LOGISTICS.MACHINE_NEW}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Máquina
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastrado</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma máquina encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  machines.map((machine) => (
                    <TableRow key={machine.id}>
                      <TableCell className="font-medium">{machine.serialNumber}</TableCell>
                      <TableCell>{machine.model}</TableCell>
                      <TableCell>{machine.clientName || "—"}</TableCell>
                      <TableCell>{getStatusBadge(machine.status)}</TableCell>
                      <TableCell>{new Date(machine.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={PATHS.LOGISTICS.MACHINE_DETAILS(machine.id)}>
                            Detalhes
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MachineList;
