import { useState, useEffect } from "react";
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
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LogisticsRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: "1",
      client: "Empresa A",
      type: "Instalação",
      date: "2024-08-15",
      status: "Pendente",
    },
    {
      id: "2",
      client: "Empresa B",
      type: "Manutenção",
      date: "2024-08-16",
      status: "Agendado",
    },
    {
      id: "3",
      client: "Empresa C",
      type: "Retirada",
      date: "2024-08-17",
      status: "Concluído",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleNewRequest = () => {
    toast({
      title: "Função não implementada",
      description: "Esta funcionalidade ainda será implementada.",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRequests = requests.filter((request) =>
    request.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Solicitações" 
        description="Gerencie as solicitações de serviços"
        actionLabel="Nova Solicitação"
        actionOnClick={handleNewRequest}
      />
      
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar solicitações..."
            className="pl-10 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <PageWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.client}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {request.date}
                  </div>
                </TableCell>
                <TableCell>
                  {request.status === "Pendente" && (
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                      Pendente
                    </span>
                  )}
                  {request.status === "Agendado" && (
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                      Agendado
                    </span>
                  )}
                  {request.status === "Concluído" && (
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                      Concluído
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      Aprovar
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Rejeitar
                      <XCircle className="ml-2 h-4 w-4" />
                    </Button>
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

export default LogisticsRequests;
