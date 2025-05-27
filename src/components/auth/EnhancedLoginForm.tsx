
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEnterpriseAuthContext } from '@/contexts/EnterpriseAuthContext';

export const EnhancedLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const { logSecurityEvent, getDeviceInfo } = useEnterpriseAuthContext();

  // Verificar se está em lockout
  const isLockedOut = lockoutTime && lockoutTime > new Date();

  // Função para registrar tentativa de login falhada
  const logFailedAttempt = async () => {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);

    // Armazenar tentativas no localStorage
    localStorage.setItem('failed_login_attempts', newAttempts.toString());
    localStorage.setItem('last_failed_attempt', new Date().toISOString());

    // Implementar lockout progressivo
    if (newAttempts >= 5) {
      const lockoutDuration = Math.min(30 * Math.pow(2, newAttempts - 5), 3600); // Max 1 hora
      const lockoutUntil = new Date(Date.now() + lockoutDuration * 1000);
      setLockoutTime(lockoutUntil);
      localStorage.setItem('lockout_until', lockoutUntil.toISOString());

      await logSecurityEvent(
        'multiple_failed_logins',
        'high',
        `${newAttempts} tentativas de login falhadas consecutivas para ${email}`,
        { 
          email, 
          attempts: newAttempts, 
          lockout_duration: lockoutDuration,
          device_info: getDeviceInfo()
        }
      );

      toast({
        title: 'Conta temporariamente bloqueada',
        description: `Muitas tentativas de login. Tente novamente em ${Math.ceil(lockoutDuration / 60)} minutos.`,
        variant: 'destructive',
      });
    }
  };

  // Função para limpar tentativas falhadas
  const clearFailedAttempts = () => {
    setFailedAttempts(0);
    setLockoutTime(null);
    localStorage.removeItem('failed_login_attempts');
    localStorage.removeItem('last_failed_attempt');
    localStorage.removeItem('lockout_until');
  };

  // Função de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLockedOut) {
      toast({
        title: 'Conta bloqueada',
        description: 'Aguarde antes de tentar novamente.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        await logFailedAttempt();
        
        // Mapear erros para português
        let errorMessage = 'Erro ao fazer login';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
        }
        
        setError(errorMessage);
        throw error;
      }

      if (data.user) {
        clearFailedAttempts();
        
        toast({
          title: 'Login realizado com sucesso',
          description: 'Bem-vindo de volta!',
        });
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar tentativas falhadas armazenadas
  useEffect(() => {
    const storedAttempts = localStorage.getItem('failed_login_attempts');
    const storedLockout = localStorage.getItem('lockout_until');
    
    if (storedAttempts) {
      setFailedAttempts(parseInt(storedAttempts));
    }
    
    if (storedLockout) {
      const lockoutDate = new Date(storedLockout);
      if (lockoutDate > new Date()) {
        setLockoutTime(lockoutDate);
      } else {
        // Lockout expirou, limpar
        clearFailedAttempts();
      }
    }
  }, []);

  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return 0;
    return Math.max(0, Math.ceil((lockoutTime.getTime() - Date.now()) / 1000));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <CardTitle className="text-2xl">Login Seguro</CardTitle>
        </div>
        <CardDescription>
          Sistema de autenticação enterprise com monitoramento de segurança
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLockedOut && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Conta temporariamente bloqueada. Tempo restante: {getRemainingLockoutTime()}s
              </AlertDescription>
            </Alert>
          )}

          {failedAttempts > 0 && !isLockedOut && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {failedAttempts} tentativa(s) falhada(s). {5 - failedAttempts} tentativa(s) restante(s).
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || isLockedOut}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isLockedOut}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || isLockedOut}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Protegido por monitoramento de segurança</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
