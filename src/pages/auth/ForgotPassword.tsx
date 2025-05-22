
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { Mail } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Spinner } from "@/components/ui/spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Placeholder for password reset functionality
    // This would need to call supabase.auth.resetPasswordForEmail(email)
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
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
          <CardTitle className="text-xl text-center">Recuperar senha</CardTitle>
          <CardDescription className="text-center">
            Digite seu email e enviaremos um link para redefinir sua senha
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className={`space-y-4 ${isMobile ? "pt-2 pb-2" : ""}`}>
            {isSuccess ? (
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <p className="text-green-800">
                  Se existir uma conta com o email {email}, você receberá instruções 
                  sobre como redefinir sua senha.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nome@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            {!isSuccess && (
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Enviando...
                  </>
                ) : (
                  "Enviar link de recuperação"
                )}
              </Button>
            )}
            
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

export default ForgotPassword;
