
import { useState } from "react";
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
import { Search, Plus, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

const ServiceList = () => {
  const [isLoading] = useState(false);
  const [services] = useState([
    {
      id: "1",
      type: "MAINTENANCE",
      status: "PENDING",
      client: "Supermercado ABC",
      address: "Rua das Flores, 123",
      scheduledFor: "2025-05-15T14:00:00Z",
      createdAt: "2025-05-10T10:30:00Z",
      machineSerial: "SN-123456"
    },
    {
      id: "2",
      type: "PAPER_REPLACEMENT",
      status: "COMPLETED",
      client: "Farmácia Central",
      address: "Av. Principal, 456",
      scheduledFor: "2025-05-08T10:00:00Z",
      createdAt: "2025-05-07T08:15:00Z",
      machineSerial: "SN-345678"
    },
    {
      id: "3",
      type: "MACHINE_REPLACEMENT",
      status: "SCHEDULED",
      client: "Restaurante XYZ",
      address: "Rua Comercial, 789",
      scheduledFor: "2025-05-20T09:00:00Z",
      createdAt: "2025-05-12T16:45:00Z",
      machineSerial: "SN-789012"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pendente" },
      SCHEDULED: { color: "bg-blue-100 text-blue-800", label: "Agendado" },
      IN_PROGRESS: { color: "bg-purple-100 text-purple-800", label: "Em andamento" },
      COMPLETED: { color: "bg-green-100 text-green-800", label: "Concluído" },
      CANCELLED: { color: "bg-red-100 text-red-800", label: "Cancelado" },
    };

    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };

    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getServiceTypeBadge = (type: string) => {
    const typeMap: Record<string, { color: string; label: string }> = {
      MAINTENANCE: { color: "bg-orange-100 text-orange-800", label: "Manutenção" },
      PAPER_REPLACEMENT: { color: "bg-indigo-100 text-indigo-800", label: "Troca de Bobina" },
      MACHINE_REPLACEMENT: { color: "bg-cyan-100 text-cyan-800", label: "Substituição" },
      INSTALLATION: { color: "bg-emerald-100 text-emerald-800", label: "Instalação" },
    };

    const typeInfo = typeMap[type] || { color: "bg-gray-100 text-gray-800", label: type };

    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${typeInfo.color}`}>
        {typeInfo.label}
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
              placeholder="Buscar por cliente, endereço ou serial..."
              className="pl-8"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PENDING">Pendentes</SelectItem>
                <SelectItem value="SCHEDULED">Agendados</SelectItem>
                <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                <SelectItem value="COMPLETED">Concluídos</SelectItem>
                <SelectItem value="CANCELLED">Cancelados</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
                <SelectItem value="PAPER_REPLACEMENT">Troca de Bobina</SelectItem>
                <SelectItem value="MACHINE_REPLACEMENT">Substituição</SelectItem>
                <SelectItem value="INSTALLATION">Instalação</SelectItem>
              </SelectContent>
            </Select>

            <Button asChild>
              <Link to={PATHS.LOGISTICS.CALENDAR}>
                <Calendar className="mr-2 h-4 w-4" />
                Calendário
              </Link>
            </Button>

            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Atendimento
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serial</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agendado para</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum atendimento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{getServiceTypeBadge(service.type)}</TableCell>
                      <TableCell className="font-medium">{service.client}</TableCell>
                      <TableCell>{service.machineSerial}</TableCell>
                      <TableCell>{getStatusBadge(service.status)}</TableCell>
                      <TableCell>
                        {new Date(service.scheduledFor).toLocaleDateString("pt-BR")}{" "}
                        {new Date(service.scheduledFor).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Detalhes
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

export default ServiceList;
