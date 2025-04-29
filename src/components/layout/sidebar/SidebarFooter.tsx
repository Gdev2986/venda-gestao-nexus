
import { useNavigate } from "react-router-dom";
import { HelpCircle, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const SidebarFooter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/");
  };

  return (
    <>
      <Separator className="my-4 bg-sidebar-border" />

      <div className="space-y-1">
        <button
          onClick={() => {
            toast({
              title: "Ajuda",
              description: "Função ainda não implementada.",
            });
          }}
          className="flex items-center w-full px-3 py-2 text-sm rounded-md text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white transition-colors"
        >
          <HelpCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <span>Ajuda</span>
        </button>

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
