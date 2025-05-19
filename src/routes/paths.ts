
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  
  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENT_DETAILS: (id?: string) => `/admin/clients/${id || ":id"}`,
    CLIENT_NEW: "/admin/clients/new",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: (id?: string) => `/admin/partners/${id || ":id"}`,
    PARTNER_NEW: "/admin/partners/new",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id?: string) => `/admin/payments/${id || ":id"}`,
    PAYMENT_NEW: "/admin/payments/new",
    MACHINES: "/admin/machines",
    SALES: "/admin/sales",
    SALES_DETAILS: (id?: string) => `/admin/sales/${id || ":id"}`,
    SALES_NEW: "/admin/sales/new",
    REPORTS: "/admin/reports",
    SETTINGS: "/admin/settings",
    USERS: "/admin/users",
    NOTIFICATIONS: "/admin/notifications",
    INTEGRATIONS: "/admin/integrations",
    LOGISTICS: "/admin/logistics",
    REQUESTS: "/admin/requests",
    HELP: "/admin/help"
  },
  
  // Financial routes
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    PAYMENT_DETAILS: (id?: string) => `/financial/payments/${id || ":id"}`,
    PAYMENT_NEW: "/financial/payments/new",
    CLIENTS: "/financial/clients",
    REPORTS: "/financial/reports",
    SETTINGS: "/financial/settings",
    EXPENSES: "/financial/expenses",
    REVENUE: "/financial/revenue",
    CLIENT_DETAILS: (id?: string) => `/financial/clients/${id || ":id"}`,
    REQUESTS: "/financial/requests"
  },
  
  // Partner routes
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    CLIENT_DETAILS: (id?: string) => `/partner/clients/${id || ":id"}`,
    COMMISSIONS: "/partner/commissions",
    REPORTS: "/partner/reports",
    SETTINGS: "/partner/settings",
    SALES: "/partner/sales",
    SUPPORT: "/partner/support",
    HELP: "/partner/help"
  },
  
  // User routes
  USER: {
    DASHBOARD: "/user/dashboard",
    PAYMENTS: "/user/payments",
    MACHINES: "/user/machines",
    SUPPORT: "/user/support",
    SETTINGS: "/user/settings",
    HELP: "/user/help"
  },
  
  // Logistics routes
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    MACHINE_NEW: "/logistics/machines/new",
    MACHINE_DETAILS: (id?: string) => `/logistics/machines/${id || ":id"}`,
    OPERATIONS: "/logistics/operations",
    REQUESTS: "/logistics/requests",
    REPORTS: "/logistics/reports",
    INVENTORY: "/logistics/inventory",
    CLIENTS: "/logistics/clients",
    SETTINGS: "/logistics/settings"
  },

  // Client routes
  CLIENT: {
    NEW: "/client/new",
    DETAILS: (id?: string) => `/client/${id || ":id"}`,
    DASHBOARD: (id?: string) => `/client/${id || ":id"}/dashboard`,
    PAYMENTS: (id?: string) => `/client/${id || ":id"}/payments`,
    MACHINES: "/machines"
  }
};
