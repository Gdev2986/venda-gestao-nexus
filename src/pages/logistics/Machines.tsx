
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import MachinesTabNavigation from "@/components/logistics/machines/MachinesTabNavigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import NewMachineDialog from "@/components/logistics/modals/NewMachineDialog";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const LogisticsMachines = () => {
  const newMachineDialog = useDialog();
  const [machineCount, setMachineCount] = useState<number | null>(null);
  
  // Fetch machine count
  useEffect(() => {
    async function fetchMachineCount() {
      try {
        const { count, error } = await supabase
          .from("machines")
          .select("*", { count: "exact", head: true });
          
        if (!error && count !== null) {
          setMachineCount(count);
        }
      } catch (error) {
        console.error("Error fetching machine count:", error);
      }
    }
    
    fetchMachineCount();
    
    // Set up realtime subscription
    const channel = supabase
      .channel("machine-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "machines" },
        () => {
          fetchMachineCount();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Máquinas" 
        description={`Gerencie o estoque, instalações e manutenção de máquinas${machineCount !== null ? ` (${machineCount} total)` : ''}`}
        action={
          <Button onClick={newMachineDialog.open}>
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Máquina
          </Button>
        }
      />
      
      <MachinesTabNavigation />
      
      <NewMachineDialog 
        open={newMachineDialog.isOpen}
        onOpenChange={newMachineDialog.close}
      />
    </div>
  );
};

export default LogisticsMachines;
