
// Sample data for charts
export const machineStatusData = [
  { name: "Operando", value: 65 },
  { name: "Em Estoque", value: 20 },
  { name: "Em Manutenção", value: 10 },
  { name: "Inativa", value: 5 }
];

export const requestsMonthlyData = [
  { name: "Jan", value: 10, total: 10 },
  { name: "Fev", value: 15, total: 15 },
  { name: "Mar", value: 8, total: 8 },
  { name: "Abr", value: 22, total: 22 },
  { name: "Mai", value: 18, total: 18 },
  { name: "Jun", value: 12, total: 12 }
];

export const slaData = [
  { name: "Instalação", value: 90 },
  { name: "Manutenção", value: 85 },
  { name: "Troca", value: 95 },
  { name: "Retirada", value: 75 }
];

export const upcomingAppointments = [
  { id: 1, client: "Mercado Central", type: "Instalação", date: "2025-05-09", status: "Agendado" },
  { id: 2, client: "Restaurante Sabores", type: "Manutenção", date: "2025-05-10", status: "Pendente" },
  { id: 3, client: "Farmácia Saúde", type: "Troca de Bobina", date: "2025-05-12", status: "Confirmado" }
];

export const recentActivities = [
  { id: 1, description: "Máquina S/N 12345 instalada no cliente Mercado Central", timestamp: "Hoje, 10:30" },
  { id: 2, description: "Nova solicitação de manutenção do Restaurante Sabores", timestamp: "Hoje, 09:15" },
  { id: 3, description: "5 novas máquinas adicionadas ao estoque", timestamp: "Ontem, 16:45" },
  { id: 4, description: "Inventário atualizado: 50 bobinas adicionadas", timestamp: "Ontem, 14:20" },
  { id: 5, description: "Máquina S/N 98765 transferida para manutenção", timestamp: "22/04/2025, 11:10" }
];
