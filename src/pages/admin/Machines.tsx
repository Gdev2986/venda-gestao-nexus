
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { Navigate } from "react-router-dom";
import { MachineList } from "@/components/logistics/machines/MachineList";

const AdminMachines = () => {
  const { userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== UserRole.ADMIN) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <MachineList data={[]} />;
};

export default AdminMachines;
