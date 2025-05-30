
import React from "react";
import { Button } from "@/components/ui/button";

interface ClientsEmptyStateProps {
  isLoading: boolean;
  onRefresh: () => void;
}

const ClientsEmptyState = ({ isLoading, onRefresh }: ClientsEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        {isLoading ? "Carregando clientes..." : "Nenhum cliente encontrado"}
      </p>
      {!isLoading && (
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={onRefresh}
        >
          Tentar Novamente
        </Button>
      )}
    </div>
  );
};

export default ClientsEmptyState;
