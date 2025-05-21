
export const PATHS = {
  // Auth Routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password", // New route for forced password change
  
  // Public Routes
  HOME: "/",
  
  // Dashboard Route
  DASHBOARD: "/dashboard",
  
  // Not Found Route
  NOT_FOUND: "/404",
  
  // Admin Routes
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENT_NEW: "/admin/clients/new",
    CLIENT_DETAILS: (id?: string) => `/admin/clients/${id || ':id'}`,
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id?: string) => `/admin/payments/${id || ':id'}`,
    PAYMENT_NEW: "/admin/payments/new",
    USERS: "/admin/users",
    TAX_BLOCKS: "/admin/tax-blocks",
    REPORTS: "/admin/reports", // Mantém para compatibilidade
    COMPANY: "/admin/company", // Nova rota principal para empresa
    COMPANY_REPORTS: "/admin/company/reports", // Nova subrota para relatórios
    COMPANY_EXPENSES: "/admin/company/expenses", // Nova subrota para despesas
    SALES: "/admin/sales",
    SALES_DETAILS: (id?: string) => `/admin/sales/${id || ':id'}`,
    SALES_NEW: "/admin/sales/new",
    SALES_IMPORT: "/admin/sales/import",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: (id?: string) => `/admin/partners/${id || ':id'}`,
    PARTNER_NEW: "/admin/partners/new",
    SUPPORT: "/admin/support",
    FEES: "/admin/fees",
    SETTINGS: "/admin/settings",
    LOGISTICS: "/admin/logistics",
  },
  
  // Client Routes
  CLIENT: {
    ROOT: "/client",
    DASHBOARD: "/client/dashboard",
    PAYMENTS: "/client/payments",
    PAYMENT_REQUEST: "/client/payments/request",
    PROFILE: "/client/profile",
    REPORTS: "/client/reports",
    SUPPORT: "/client/support",
    MACHINES: "/client/machines",
  },
  
  // User Routes (for general client access)
  USER: {
    DASHBOARD: "/user/dashboard",
    PAYMENTS: "/user/payments",
    SUPPORT: "/user/support",
    HELP: "/user/help",
    SETTINGS: "/user/settings",
    MACHINES: "/user/machines",
  },
  
  // Partner Routes
  PARTNER: {
    ROOT: "/partner",
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    CLIENT_DETAILS: (id?: string) => `/partner/clients/${id || ':id'}`,
    SALES: "/partner/sales",
    COMMISSIONS: "/partner/commissions",
    PROFILE: "/partner/profile",
    REPORTS: "/partner/reports",
    SUPPORT: "/partner/support",
    HELP: "/partner/help",
    SETTINGS: "/partner/settings",
  },
  
  // Finance Routes
  FINANCE: {
    ROOT: "/finance",
    DASHBOARD: "/finance/dashboard",
    PAYMENTS: "/finance/payments",
    PAYMENT_REQUESTS: "/finance/payment-requests",
    REPORTS: "/finance/reports",
    SETTINGS: "/finance/settings",
  },
  
  // Financial Routes (to match existing imports)
  FINANCIAL: {
    ROOT: "/financial",
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    PAYMENT_REQUESTS: "/financial/payment-requests",
    REPORTS: "/financial/reports",
    SETTINGS: "/financial/settings",
    CLIENTS: "/financial/clients", // Added as it's referenced in Dashboard
    REQUESTS: "/financial/requests", // Added as it's referenced in Dashboard
  },
  
  // Logistics Routes
  LOGISTICS: {
    ROOT: "/logistics",
    DASHBOARD: "/logistics/dashboard",
    CLIENTS: "/logistics/clients",
    MACHINES: "/logistics/machines",
    MACHINE_DETAILS: (id?: string) => `/logistics/machines/${id || ':id'}`,
    MACHINE_NEW: "/logistics/machines/new",
    SUPPORT_REQUESTS: "/logistics/support-requests",
    OPERATIONS: "/logistics/operations",
    REQUESTS: "/logistics/requests",
    REPORTS: "/logistics/reports",
    SETTINGS: "/logistics/settings",
    INVENTORY: "/logistics/inventory", // Added as it's referenced in routes
  },
  
  // Support Routes
  SUPPORT: {
    ROOT: "/support",
    DASHBOARD: "/support/dashboard",
    TICKETS: "/support/tickets",
    CLIENTS: "/support/clients",
  },
  
  // Manager Routes
  MANAGER: {
    ROOT: "/manager",
    DASHBOARD: "/manager/dashboard",
    CLIENTS: "/manager/clients",
    SALES: "/manager/sales",
    REPORTS: "/manager/reports",
  },
};
