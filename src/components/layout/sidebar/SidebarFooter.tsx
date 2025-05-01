
import { HelpCircle, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SidebarFooter = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();

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
    await signOut();
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


        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm rounded-md text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </>
  );
};

export default SidebarFooter;
