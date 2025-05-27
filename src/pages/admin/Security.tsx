
import React from 'react';
import { PageHeader } from '@/components/page/PageHeader';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

const Security = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Centro de Segurança"
        description="Monitoramento e gestão de segurança enterprise"
      />

      {/* Cards de Funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autenticação</CardTitle>
            <Lock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Sistema JWT com roles granulares e MFA
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auditoria</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Logs completos de todas as ações do sistema
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detecção</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Detecção automática de atividades suspeitas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proteção</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              RLS, rate limiting e proteção CSRF
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Principal */}
      <SecurityDashboard />

      {/* Informações de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos de Segurança Implementados</CardTitle>
          <CardDescription>
            Lista completa das funcionalidades de segurança enterprise ativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Autenticação & Autorização</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>JWT Claims automáticos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Row Level Security (RLS)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Roles baseadas em tabela separada</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Funções SECURITY DEFINER</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Monitoramento & Auditoria</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Logs de auditoria completos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Detecção de atividades suspeitas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Gestão de sessões avançada</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Monitoramento em tempo real</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
