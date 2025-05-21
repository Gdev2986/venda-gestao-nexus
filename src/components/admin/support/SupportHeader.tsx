
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import React from "react";

interface SupportHeaderProps {
  activeTab: string;
  onCreateAgent: () => void;
}

const SupportHeader = ({ activeTab, onCreateAgent }: SupportHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <PageHeader 
          title="Suporte ao Cliente" 
          description="Gerencie tickets de suporte e atendimento ao cliente" 
        />
      </div>
      
      {activeTab === "agents" && (
        <Button onClick={onCreateAgent}>
          Adicionar Agente
        </Button>
      )}
    </div>
  );
};

export default SupportHeader;
