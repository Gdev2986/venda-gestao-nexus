
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { Navigate } from "react-router-dom";
import { MachinesPageContent } from "@/components/logistics/machines/MachinesPageContent";

const AdminMachines = () => {
  const { userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== UserRole.ADMIN) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <MachinesPageContent />
    </div>
  );
};

export default AdminMachines;
