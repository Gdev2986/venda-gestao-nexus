
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { PATHS } from "@/routes/paths";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsChange, setNeedsChange] = useState(false);
  const { user, refreshSession } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user needs to change password
  useEffect(() => {
    const checkPasswordStatus = async () => {
      if (!user) {
        navigate(PATHS.LOGIN);
        return;
      }
      
      setIsLoading(true);
      try {
        const needsPasswordChange = await AuthService.needsPasswordChange();
        setNeedsChange(needsPasswordChange);
        
        if (!needsPasswordChange) {
          // Redirect to dashboard if password change not needed
          navigate(PATHS.DASHBOARD);
        }
      } catch (error) {
        console.error("Error checking password status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPasswordStatus();
  }, [user, navigate]);
  
  const validatePassword = () => {
    setPasswordError("");
    
    if (newPassword.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres");
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await AuthService.changePasswordAndActivate(newPassword);
      
      if (success) {
        toast({
          title: "Senha alterada com sucesso",
          description: "Sua conta foi ativada. Você pode acessar o sistema agora.",
        });
        
        // Refresh session to update user status
        await refreshSession();
        
        // Redirect to dashboard
        navigate(PATHS.DASHBOARD);
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao alterar senha",
          description: "Não foi possível alterar sua senha. Tente novamente mais tarde.",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        variant: "destructive",
        title: "Erro ao alterar senha",
        description: "Ocorreu um erro durante a alteração da senha.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Verificando conta...</p>
      </div>
    );
  }
  
  if (!needsChange) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <CheckCircle className="h-5 w-5 text-primary" />
          <AlertDescription>
            Sua senha já foi alterada. Redirecionando para o painel...
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-primary-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Primeiro Acesso</CardTitle>
          <CardDescription className="text-center">
            Para ativar sua conta, é necessário criar uma nova senha.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {passwordError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                A senha deve ter pelo menos 8 caracteres
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Alterando senha...
                </>
              ) : (
                "Confirmar e Ativar Conta"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
