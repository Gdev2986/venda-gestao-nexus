
import React from "react";

export interface AdminSalesLayoutProps {
  children: React.ReactNode;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

const AdminSalesLayout: React.FC<AdminSalesLayoutProps> = ({ 
  children,
  isRefreshing,
  onRefresh,
  onImport,
  onExport
}) => {
  return <div className="space-y-4">{children}</div>;
};

export default AdminSalesLayout;
