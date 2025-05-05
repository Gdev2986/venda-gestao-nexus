
import { useState } from "react";
import { Client } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientStatus } from "./ClientStatus";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClientDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  partners: { id: string; company_name: string }[];
  feePlans: { id: string; name: string }[];
  onEdit: () => void;
  onDelete: () => void;
  getMachineCount: (clientId: string) => number;
}

export const ClientDetailsModal = ({
  open,
  onOpenChange,
  client,
  partners,
  feePlans,
  onEdit,
  onDelete,
  getMachineCount
}: ClientDetailsModalProps) => {
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState<number>(0);
  const [balanceNote, setBalanceNote] = useState<string>("");
  const { toast } = useToast();

  if (!client) {
    return null;
  }

  const getPartnerName = (partnerId: string | undefined) => {
    if (!partnerId) return "Nenhum";
    const partner = partners.find(p => p.id === partnerId);
    return partner ? partner.company_name : "Desconhecido";
  };

  const getFeePlanName = (planId: string | undefined) => {
    if (!planId) return "Padrão do sistema";
    const plan = feePlans.find(p => p.id === planId);
    return plan ? plan.name : "Desconhecido";
  };

  const handleBalanceUpdate = () => {
    // In a real implementation, update in Supabase
    toast({
      title: "Saldo atualizado",
      description: "O cliente será notificado sobre esta alteração.",
    });
    setIsBalanceModalOpen(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {client.business_name}
              <ClientStatus status={client.status || "active"} />
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="machines">Máquinas</TabsTrigger>
              <TabsTrigger value="system">Sistema</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="info" className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Contato</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Nome:</dt>
                        <dd>{client.contact_name || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Email:</dt>
                        <dd>{client.email || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Telefone:</dt>
                        <dd>{client.phone || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Documento:</dt>
                        <dd>{client.document || "—"}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Endereço</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Endereço:</dt>
                        <dd>{client.address || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Cidade:</dt>
                        <dd>{client.city || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Estado:</dt>
                        <dd>{client.state || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">CEP:</dt>
                        <dd>{client.zip || "—"}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Machines */}
            <TabsContent value="machines" className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle>Máquinas Vinculadas</CardTitle>
                  <CardDescription>
                    Este cliente possui {getMachineCount(client.id)} máquinas vinculadas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {getMachineCount(client.id) === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma máquina vinculada a este cliente.
                    </p>
                  ) : (
                    <p className="text-center py-8">
                      Lista de máquinas implementada em um módulo separado.
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Gerenciar Máquinas
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* System Information */}
            <TabsContent value="system" className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Financeiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Saldo Atual:</dt>
                        <dd className={`font-mono font-medium ${client.balance != null && client.balance < 0 ? 'text-destructive' : ''}`}>
                          {client.balance != null ? client.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Plano de Taxas:</dt>
                        <dd>{getFeePlanName(client.fee_plan_id)}</dd>
                      </div>
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setBalanceAmount(client.balance != null ? client.balance : 0);
                            setIsBalanceModalOpen(true);
                          }}
                        >
                          Ajustar Saldo
                        </Button>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Parceiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Parceiro Vinculado:</dt>
                        <dd>{getPartnerName(client.partner_id)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Criado em:</dt>
                        <dd>{formatDate(client.created_at)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Última atualização:</dt>
                        <dd>{formatDate(client.updated_at)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="destructive" onClick={onDelete}>Excluir</Button>
            <Button variant="default" onClick={onEdit}>Editar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Balance Adjustment Modal */}
      <AlertDialog open={isBalanceModalOpen} onOpenChange={setIsBalanceModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ajustar Saldo do Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              O cliente será notificado sobre esta alteração de saldo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Novo valor do saldo (R$)</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Nota sobre o ajuste (opcional)</Label>
              <Input
                id="note"
                value={balanceNote}
                onChange={(e) => setBalanceNote(e.target.value)}
                placeholder="Motivo do ajuste de saldo"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBalanceUpdate}>
              Confirmar Ajuste
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClientDetailsModal;
