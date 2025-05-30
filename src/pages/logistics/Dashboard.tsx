import React from 'react';
import { PageHeader } from "@/components/page/PageHeader";
import { motion } from "framer-motion";
import ShipmentsSection from "@/components/logistics/shipments/ShipmentsSection";
import LogisticsStatsCards from "@/components/logistics/dashboard/LogisticsStatsCards";
import { useLogisticsStats } from "@/hooks/use-logistics-stats";

const LogisticsDashboard = () => {
  const { stats, isLoading } = useLogisticsStats();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Logística" 
        description="Visão geral das operações logísticas"
      />

      {/* Stats Cards - integrados com banco de dados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LogisticsStatsCards stats={stats} isLoading={isLoading} />
      </motion.div>

      {/* Shipments Section - mantém a funcionalidade existente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ShipmentsSection />
      </motion.div>
    </div>
  );
};

export default LogisticsDashboard;
