
import React from "react";

export interface SalesData {
  id: string;
  date: string;
  amount: number;
  client: string;
  status: string;
}

export interface AdminSalesContentProps {
  sales: SalesData[];
  filters: {
    search: string;
    status: string;
    dateRange: {
      from: Date;
      to: Date;
    };
  };
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
}

const AdminSalesContent: React.FC<AdminSalesContentProps> = ({
  sales,
  filters,
  isLoading,
  page,
  setPage,
  itemsPerPage
}) => {
  return (
    <div>
      <p>Sales content would display here</p>
    </div>
  );
};

export default AdminSalesContent;
