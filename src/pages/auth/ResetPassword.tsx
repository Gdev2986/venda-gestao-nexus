
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Spinner } from "@/components/ui/spinner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    
    setIsSubmitting(true);
    
    // Placeholder for password reset functionality
    // This would need to call supabase.auth.updateUser({ password })
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(PATHS.LOGIN);
    }, 1000);
  };
  
  return (
    <div className="w-full max-w-md">
      <Card className="border-0 shadow-lg">
        <CardHeader className={isMobile ? "pb-2" : ""}>
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-bold mr-2">
              SP
            </div>
            <h1 className="text-2xl font-bold">SigmaPay</h1>
          </div>
          <CardTitle className="text-xl text-center">Criar nova senha</CardTitle>
          <CardDescription className="text-center">
            Digite sua nova senha para recuperar o acesso à sua conta
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className={`space-y-4 ${isMobile ? "pt-2 pb-2" : ""}`}>
            {error && (
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Alternar visibilidade da senha</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="confirm-password" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Alternar visibilidade da senha</span>
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Atualizando...
                </>
              ) : (
                "Atualizar senha"
              )}
            </Button>
            
            <Link 
              to={PATHS.LOGIN}
              className="text-center text-sm text-muted-foreground hover:text-primary"
            >
              Voltar para o login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
