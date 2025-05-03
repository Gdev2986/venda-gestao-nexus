
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserSupport = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Central de Suporte" 
        description="Abra e acompanhe chamados de suporte e assistência"
      />
      
      <Tabs defaultValue="new">
        <TabsList className="mb-6">
          <TabsTrigger value="new">Novo Chamado</TabsTrigger>
          <TabsTrigger value="open">Chamados Abertos</TabsTrigger>
          <TabsTrigger value="closed">Chamados Fechados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Abrir Novo Chamado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="subject">
                    Assunto
                  </label>
                  <Input id="subject" placeholder="Resumo do seu problema ou solicitação" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="type">
                    Tipo de Chamado
                  </label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Suporte Técnico</SelectItem>
                      <SelectItem value="billing">Financeiro</SelectItem>
                      <SelectItem value="machine">Problema na Máquina</SelectItem>
                      <SelectItem value="supply">Solicitação de Materiais</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="machine">
                    Máquina (se aplicável)
                  </label>
                  <Select>
                    <SelectTrigger id="machine">
                      <SelectValue placeholder="Selecione uma máquina" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as máquinas</SelectItem>
                      <SelectItem value="sn-100001">SN-100001 (Terminal Pro)</SelectItem>
                      <SelectItem value="sn-100002">SN-100002 (Terminal Standard)</SelectItem>
                      <SelectItem value="sn-100003">SN-100003 (Terminal Pro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="description">
                    Descrição
                  </label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva seu problema ou solicitação em detalhes..." 
                    className="min-h-[150px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="attachments">
                    Anexos (opcional)
                  </label>
                  <Input id="attachments" type="file" />
                </div>
                
                <div className="pt-4">
                  <Button>Enviar Chamado</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="open">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "#5001", subject: "Máquina com erro de conexão", date: "22/04/2025", type: "Técnico", status: "Em análise" },
                  { id: "#4998", subject: "Solicitação de bobinas", date: "20/04/2025", type: "Material", status: "Em separação" },
                ].map((ticket, i) => (
                  <TableRow key={i}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.date}</TableCell>
                    <TableCell>{ticket.type}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                        {ticket.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="closed">
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "#4982", subject: "Troca de bateria", date: "15/04/2025", type: "Técnico", status: "Concluído" },
                  { id: "#4975", subject: "Dúvida sobre extrato", date: "10/04/2025", type: "Financeiro", status: "Concluído" },
                  { id: "#4960", subject: "Solicitação de bobinas", date: "05/04/2025", type: "Material", status: "Entregue" },
                ].map((ticket, i) => (
                  <TableRow key={i}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.date}</TableCell>
                    <TableCell>{ticket.type}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                        {ticket.status}
                      </span>
                    </TableCell>
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

export default UserSupport;
