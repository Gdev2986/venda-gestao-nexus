import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const ServiceRequests = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Solicitações de Serviço" 
        description="Gerencie as solicitações de serviço dos clientes"
        actionLabel="Nova Solicitação"
        actionOnClick={() => toast({
          title: "Função não implementada",
          description: "Esta funcionalidade ainda será implementada."
        })}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative flex-1 md:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar solicitações..."
            className="pl-8 bg-background"
          />
        </div>
        
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("2023-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <PageWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo de Serviço</TableHead>
              <TableHead>Data de Solicitação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { client: "João Silva", serviceType: "Instalação", requestDate: "10/05/2024", status: "Pendente" },
              { client: "Maria Oliveira", serviceType: "Manutenção", requestDate: "12/05/2024", status: "Aprovado" },
              { client: "Carlos Pereira", serviceType: "Reparo", requestDate: "15/05/2024", status: "Pendente" },
              { client: "Ana Souza", serviceType: "Visita Técnica", requestDate: "18/05/2024", status: "Concluído" },
            ].map((request, i) => (
              <TableRow key={i}>
                <TableCell>{request.client}</TableCell>
                <TableCell>{request.serviceType}</TableCell>
                <TableCell>{request.requestDate}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Ver Detalhes</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageWrapper>
    </div>
  );
};

export default ServiceRequests;
