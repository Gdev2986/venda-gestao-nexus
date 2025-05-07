
import React from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page/PageHeader";
import { PlusCircle, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  onRefresh: () => void;
  onNewMachine: () => void;
  onNewRequest: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onRefresh, 
  onNewMachine, 
  onNewRequest 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <PageHeader 
        title="Dashboard de Logística" 
        description="Visão consolidada de operações, máquinas e solicitações"
      />
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onNewMachine}
        >
          <PlusCircle className="h-4 w-4" />
          Nova Máquina
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onNewRequest}
        >
          <PlusCircle className="h-4 w-4" />
          Nova Solicitação
        </Button>
        <Button variant="default" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
