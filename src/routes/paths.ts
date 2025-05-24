export const PATHS = {
  // Auth
  LOGIN: "/login",
  FORGOT_PASSWORD: "/esqueci-senha",
  RESET_PASSWORD: "/redefinir-senha",
  CHANGE_PASSWORD: "/alterar-senha",

  // Dashboard
  DASHBOARD: "/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
  CLIENT_DASHBOARD: "/cliente/dashboard",

  // Admin
  ADMIN_MACHINES: "/admin/maquinas",
  ADMIN_CLIENTS: "/admin/clientes",
  ADMIN_PAYMENTS: "/admin/pagamentos",
  ADMIN_SETTINGS: "/admin/configuracoes",

  // Client
  CLIENT_MACHINES: "/cliente/maquinas",
  CLIENT_PAYMENTS: "/cliente/pagamentos",
  CLIENT_PROFILE: "/cliente/perfil",

  // Error
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/unauthorized"
} as const;
