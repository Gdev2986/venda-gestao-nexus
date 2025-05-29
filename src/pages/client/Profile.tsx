
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { User, Building, MapPin, Phone, Mail, Calendar } from "lucide-react";

const ClientProfile = () => {
  const { user, profile } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meu Perfil"
        description="Visualize e edite suas informações pessoais e empresariais"
      />
      
      <div className="grid gap-6">
        {/* Informações Pessoais */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue={profile?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Conta</Label>
                <div className="pt-2">
                  <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                    Cliente
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Empresa */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Nome da Empresa</Label>
                <Input id="company" placeholder="Nome da sua empresa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" placeholder="Rua, número, bairro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade/Estado</Label>
                <Input id="city" placeholder="Cidade - UF" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Negócio</Label>
              <Textarea 
                id="description" 
                placeholder="Descreva brevemente o tipo de negócio..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações da Conta */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Data de Cadastro</Label>
                <p>{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Status da Conta</Label>
                <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                  Ativa
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Último Acesso</Label>
                <p>{new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">ID do Cliente</Label>
                <p className="font-mono text-xs">{user?.id?.substring(0, 8) || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">
            Cancelar
          </Button>
          <Button>
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
