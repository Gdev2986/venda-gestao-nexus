
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AdminSecurityTab = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState("strong");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  
  const handleSaveSecuritySettings = () => {
    toast({
      title: "Configurações de segurança salvas",
      description: "As configurações de segurança foram atualizadas."
    });
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Segurança da Conta</CardTitle>
          <CardDescription>
            Configure opções de autenticação e segurança para contas de administrador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="two-factor" className="text-base font-medium">
                Autenticação de Dois Fatores
              </Label>
              <p className="text-sm text-muted-foreground">
                Exigir que administradores usem autenticação de dois fatores
              </p>
            </div>
            <Switch 
              id="two-factor" 
              checked={twoFactorEnabled} 
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password-policy">Política de Senhas</Label>
            <Select value={passwordPolicy} onValueChange={setPasswordPolicy}>
              <SelectTrigger id="password-policy">
                <SelectValue placeholder="Selecione uma política" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Básica (mínimo 8 caracteres)</SelectItem>
                <SelectItem value="medium">Média (mínimo 10 caracteres, números e símbolos)</SelectItem>
                <SelectItem value="strong">Forte (mínimo 12 caracteres, maiúsculas, números e símbolos)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Tempo Limite de Sessão (minutos)</Label>
            <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
              <SelectTrigger id="session-timeout">
                <SelectValue placeholder="Selecione um tempo limite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
                <SelectItem value="240">4 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleSaveSecuritySettings} className="mt-4">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Redefinir Senha</CardTitle>
          <CardDescription>
            Altere sua senha de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input id="current-password" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input id="new-password" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirme a nova senha</Label>
              <Input id="confirm-password" type="password" />
            </div>
            
            <Button type="submit">
              Alterar senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
