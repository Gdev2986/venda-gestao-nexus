
import { HelpCircle, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const SidebarFooter = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors

        if (error) {
          console.error('Erro ao buscar nome do usuário:', error);
          return;
        }

        if (data && data.name) {
          setUserName(data.name);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log("Logout requested");
      await signOut();
      // Note: No need for redirect here as it's handled in the AuthProvider
    } catch (error) {
      console.error("Error in handleLogout:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível encerrar sua sessão",
        variant: "destructive"
      });
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Separator className="my-4 bg-sidebar-border" />

      {userName && (
        <div className="px-3 py-2">
          <p className="text-sm text-sidebar-foreground">
            Logado como: <span className="font-semibold">{userName}</span>
          </p>
        </div>
      )}

      <div className="space-y-1">
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start px-3 py-2 text-sm rounded-md text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white transition-colors"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
          <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
        </Button>
      </div>
    </>
  );
};

export default SidebarFooter;
