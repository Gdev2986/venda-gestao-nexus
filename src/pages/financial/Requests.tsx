
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
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { PATHS } from "@/routes/paths";

const FinancialRequests = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Solicitações" 
        description="Gerencie todas as solicitações financeiras"
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar solicitações..."
            className="pl-8 bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="payment">Pagamentos</SelectItem>
              <SelectItem value="commission">Comissões</SelectItem>
              <SelectItem value="refund">Reembolsos</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="pending">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="approved">Aprovados</SelectItem>
              <SelectItem value="rejected">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Filtrar</Button>
        </div>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="approved">Aprovados</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "#5001", type: "Comissão", requestor: "Parceiro ABC", value: "R$ 1.200,00", date: "22/04/2025" },
                  { id: "#5000", type: "Reembolso", requestor: "Cliente XYZ", value: "R$ 350,00", date: "22/04/2025" },
                  { id: "#4999", type: "Pagamento", requestor: "Cliente DEF", value: "R$ 2.500,00", date: "21/04/2025" },
                  { id: "#4998", type: "Comissão", requestor: "Parceiro 123", value: "R$ 980,00", date: "21/04/2025" },
                  { id: "#4997", type: "Pagamento", requestor: "Cliente GHI", value: "R$ 1.800,00", date: "20/04/2025" },
                ].map((request, i) => (
                  <TableRow key={i}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.requestor}</TableCell>
                    <TableCell>{request.value}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm">Aprovar</Button>
                        <Button size="sm" variant="outline">Recusar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="approved">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Aprovado em</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "#4995", type: "Pagamento", requestor: "Cliente JKL", value: "R$ 3.200,00", date: "19/04/2025", approvedDate: "20/04/2025" },
                  { id: "#4992", type: "Comissão", requestor: "Parceiro MNO", value: "R$ 1.450,00", date: "18/04/2025", approvedDate: "19/04/2025" },
                  { id: "#4989", type: "Reembolso", requestor: "Cliente PQR", value: "R$ 420,00", date: "17/04/2025", approvedDate: "18/04/2025" },
                ].map((request, i) => (
                  <TableRow key={i}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.requestor}</TableCell>
                    <TableCell>{request.value}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>{request.approvedDate}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="rejected">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Rejeitado em</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "#4988", type: "Comissão", requestor: "Parceiro STU", value: "R$ 2.100,00", date: "17/04/2025", rejectedDate: "18/04/2025" },
                  { id: "#4985", type: "Pagamento", requestor: "Cliente VWX", value: "R$ 1.800,00", date: "16/04/2025", rejectedDate: "17/04/2025" },
                ].map((request, i) => (
                  <TableRow key={i}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.requestor}</TableCell>
                    <TableCell>{request.value}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>{request.rejectedDate}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialRequests;
