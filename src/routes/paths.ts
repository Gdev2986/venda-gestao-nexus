export const PATHS = {
  // Auth
  LOGIN: "/login",
  FORGOT_PASSWORD: "/esqueci-senha",
  RESET_PASSWORD: "/redefinir-senha",
  CHANGE_PASSWORD: "/alterar-senha",

  // Admin Routes
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard", // Rota padrão para admin
    CLIENTS: "/admin/clientes",
    MACHINES: "/admin/maquinas",
    PAYMENTS: "/admin/pagamentos",
    SETTINGS: "/admin/configuracoes",
    USERS: "/admin/usuarios",
    REPORTS: "/admin/relatorios",
  },

  // Client Routes  
  CLIENT: {
    ROOT: "/client",
    DASHBOARD: "/client/dashboard", // Rota padrão para client
    MACHINES: "/client/maquinas",
    PAYMENTS: "/client/pagamentos",
    PROFILE: "/client/perfil",
    REPORTS: "/client/relatorios",
  },

  // Partner Routes
  PARTNER: {
    ROOT: "/partner", 
    DASHBOARD: "/partner/dashboard", // Rota padrão para partner
    CLIENTS: "/partner/clientes",
    COMMISSIONS: "/partner/comissoes",
    REPORTS: "/partner/relatorios",
  },

  // Financial Routes
  FINANCIAL: {
    ROOT: "/financial",
    DASHBOARD: "/financial/dashboard", // Rota padrão para financial
    PAYMENTS: "/financial/pagamentos",
    REPORTS: "/financial/relatorios",
    REQUESTS: "/financial/solicitacoes",
  },

  // Logistics Routes
  LOGISTICS: {
    ROOT: "/logistics",
    DASHBOARD: "/logistics/dashboard", // Rota padrão para logistics
    MACHINES: "/logistics/maquinas",
    OPERATIONS: "/logistics/operacoes",
    INVENTORY: "/logistics/inventario",
  },

  // Error Routes
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/unauthorized"
} as const;
