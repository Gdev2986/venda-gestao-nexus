
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Partner } from "@/types/partner.types";
import { Building2, Mail, Phone, Calendar, DollarSign, Users, TrendingUp } from "lucide-react";

interface PartnerDetailsModalProps {
  partner: Partner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PartnerDetailsModal = ({ partner, open, onOpenChange }: PartnerDetailsModalProps) => {
  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {partner.company_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Parceiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Empresa:</span>
                  <span>{partner.company_name}</span>
                </div>
                
                {partner.contact_name && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Contato:</span>
                    <span>{partner.contact_name}</span>
                  </div>
                )}
                
                {partner.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span className="text-sm">{partner.contact_email}</span>
                  </div>
                )}
                
                {partner.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Telefone:</span>
                    <span>{partner.contact_phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Criado em:</span>
                  <span>{new Date(partner.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <div className="text-2xl font-bold text-green-600">
                    {partner.commission_rate}%
                  </div>
                  <div className="text-xs text-muted-foreground">Comissão Atual</div>
                </div>
                
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Users className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <div className="text-2xl font-bold text-blue-600">
                    {partner.total_sales || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Total de Vendas</div>
                </div>
                
                <div className="text-center p-3 bg-muted rounded-lg col-span-2">
                  <TrendingUp className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <div className="text-2xl font-bold text-purple-600">
                    R$ {(partner.total_commission || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-muted-foreground">Total de Comissões</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Retiradas */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Retiradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma retirada registrada ainda</p>
                <p className="text-sm">As retiradas aparecerão aqui quando forem processadas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
