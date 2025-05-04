import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client, ClientStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { deleteClient } from "@/api/clientsApi";
import { confirm } from "@/components/ui/confirm";

interface ClientsListProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const ClientsList = ({ clients, setClients }: ClientsListProps) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredClients = clients.filter((client) =>
    client?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/admin/clients/${id}`);
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: "Deletar cliente?",
      description: "Tem certeza de que deseja deletar este cliente? Esta ação não pode ser desfeita.",
      onConfirm: async () => {
        try {
          const success = await deleteClient(id);
          if (success) {
            setClients(clients.filter((client) => client.id !== id));
            toast({
              title: "Sucesso",
              description: "Cliente deletado com sucesso.",
            });
          } else {
            toast({
              title: "Erro",
              description: "Falha ao deletar o cliente.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao deletar o cliente.",
            variant: "destructive",
          });
        }
      },
    });
  };

  const getStatusBadge = (client: Client) => {
    if (client.status === ClientStatus.ACTIVE) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          Ativo
        </Badge>
      );
    } else if (client.status === ClientStatus.BLOCKED) {
      return (
        <Badge variant="destructive">
          Bloqueado
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          Pendente
        </Badge>
      );
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{getStatusBadge(client)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(client.id)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(client.id)}>
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsList;
