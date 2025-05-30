
import React from "react";

interface ClientsDebugInfoProps {
  clientsCount: number;
  shipmentsCount: number;
}

const ClientsDebugInfo = ({ clientsCount, shipmentsCount }: ClientsDebugInfoProps) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
      Debug: {clientsCount} clientes carregados, {shipmentsCount} envios
    </div>
  );
};

export default ClientsDebugInfo;
