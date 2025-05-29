
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/enums";
import { Navigate } from "react-router-dom";
import { MachineList } from "@/components/logistics/MachineList";

const AdminMachines = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== UserRole.ADMIN) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <MachineList />;
};

export default AdminMachines;
