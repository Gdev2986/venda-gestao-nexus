import React from 'react';
import { PageHeader } from "@/components/page/PageHeader";
import DoughnutChart from "@/components/charts/DoughnutChart";

const LogisticsDashboard = () => {
  // Mock data for the doughnut chart
  const chartData = [
    { name: 'Instalação', value: 400 },
    { name: 'Manutenção', value: 300 },
    { name: 'Reparo', value: 300 },
    { name: 'Outros', value: 200 },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Painel de Logística"
        description="Visão geral das operações de logística"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Example Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Solicitações de Serviço</h3>
          <DoughnutChart data={chartData} title="Tipos de Solicitações" />
        </div>

        {/* Add more cards/components here to display relevant logistics data */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Próximas Operações</h3>
          <p className="text-gray-600">Nenhuma operação agendada para hoje.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Níveis de Estoque</h3>
          <p className="text-gray-600">Estoque atualizado.</p>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
