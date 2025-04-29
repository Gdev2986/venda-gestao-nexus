
import { HelpCircle, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SidebarFooter = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
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
