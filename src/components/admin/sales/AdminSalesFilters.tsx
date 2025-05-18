
import React from "react";

export interface AdminSalesFiltersProps {
  filters: {
    search: string;
    status: string;
    dateRange: {
      from: Date;
      to: Date;
    };
  };
  onFilter?: () => void;
}

const AdminSalesFilters: React.FC<AdminSalesFiltersProps> = ({
  filters,
  onFilter
}) => {
  return (
    <div>
      <p>Sales filters would display here</p>
    </div>
  );
};

export default AdminSalesFilters;
