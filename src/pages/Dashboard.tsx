
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesChart from "@/components/dashboard/SalesChart";
import SalesTable from "@/components/dashboard/SalesTable";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Add a slight delay for initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 0.5 second loading time
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Carregando dashboard...</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardHeader />
      <StatsCards />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SalesChart />
        <SalesTable />
      </div>
    </motion.div>
  );
};

export default Dashboard;
