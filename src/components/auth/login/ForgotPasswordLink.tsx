
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPasswordLink = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleForgotPassword = async () => {
    const email = document.getElementById("email") as HTMLInputElement;
    if (!email.value || !email.value.includes("@")) {
      toast({
        variant: "destructive",
        title: "Email inválido",
        description: "Por favor, informe um email válido para redefinir sua senha",
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.value,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Instruções para redefinir sua senha foram enviadas para seu email.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao enviar email de redefinição de senha",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      variant="link"
      className="p-0 h-auto font-normal"
      onClick={handleForgotPassword}
      disabled={isProcessing}
    >
      {isProcessing ? "Enviando..." : "Esqueci minha senha"}
    </Button>
  );
};

export default ForgotPasswordLink;
