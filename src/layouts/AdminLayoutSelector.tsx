
import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";

interface MainLayoutProps {
  children: React.ReactNode;
}

const AdminLayoutSelector = () => {
  const { userRole } = useUserRole();

  // Use MainLayout as the default layout for admin users
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AdminLayoutSelector;
