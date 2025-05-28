
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import { NewRequestDialog } from "@/components/logistics/modals/NewRequestDialog";

const LogisticsRequests = () => {
  const newRequestDialog = useDialog();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Solicitações de Serviço"
        description="Gerencie solicitações de instalação, manutenção e suporte"
        action={
          <Button onClick={newRequestDialog.open}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Solicitação
          </Button>
        }
      />
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Sistema de solicitações em desenvolvimento
        </p>
      </div>
      
      <NewRequestDialog 
        open={newRequestDialog.isOpen}
        onOpenChange={newRequestDialog.close}
      />
    </div>
  );
};

export default LogisticsRequests;
