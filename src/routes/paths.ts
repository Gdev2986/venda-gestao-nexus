
/**
 * Definição de caminhos do sistema
 * Centraliza todas as rotas para facilitar a manutenção
 */

export const PATHS = {
  // Páginas principais
  HOME: "/",
  DASHBOARD: "/dashboard",
  
  // Clientes
  CLIENTS: "/clients",
  CLIENT_DETAILS: (id: string = ":id") => `/clients/${id}`,
  CLIENT_NEW: "/clients/new",
  
  // Máquinas
  MACHINES: "/machines",
  MACHINE_DETAILS: (id: string = ":id") => `/machines/${id}`,
  MACHINE_NEW: "/machines/new",
  
  // Vendas
  SALES: "/sales",
  SALES_DETAILS: (id: string = ":id") => `/sales/${id}`,
  SALES_NEW: "/sales/new",
  
  // Pagamentos
  PAYMENTS: "/payments",
  PAYMENT_DETAILS: (id: string = ":id") => `/payments/${id}`,
  PAYMENT_NEW: "/payments/new",
  USER_PAYMENTS: "/user-payments", // Rota para pagamentos do cliente
  CLIENT_PAYMENTS: "/client-payments", // Nova rota para compatibilidade com o sidebar
  
  // Parceiros
  PARTNERS: "/partners",
  PARTNER_DETAILS: (id: string = ":id") => `/partners/${id}`,
  PARTNER_NEW: "/partners/new",
  
  // Registros
  REGISTER: "/register",
  
  // Taxas
  FEES: "/fees",
  
  // Relatórios
  REPORTS: "/reports",
  
  // Configurações
  SETTINGS: "/settings",
  USER_MANAGEMENT: "/settings/users",
  
  // Suporte
  SUPPORT: "/support",

  // Ajuda
  HELP: "/help",
  
  // Não encontrado
  NOT_FOUND: "*"
};
