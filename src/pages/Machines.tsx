
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/enums";
import { Navigate } from "react-router-dom";
import { MachineList } from "@/components/logistics/MachineList";

const Machines = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has permission to view machines
  if (user.role !== UserRole.ADMIN && user.role !== UserRole.LOGISTICS) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <MachineList />;
};

export default Machines;
