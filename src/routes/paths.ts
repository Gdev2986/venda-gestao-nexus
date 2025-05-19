
export const PATHS = {
  // Public routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  
  // User routes
  USER: {
    DASHBOARD: "/user/dashboard",
    PAYMENTS: "/user/payments",
    MACHINES: "/user/machines",
    SUPPORT: "/user/support",
    SETTINGS: "/user/settings",
  },
  
  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    PARTNERS: "/admin/partners",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id = ":id") => `/admin/payments/${id}`,
    PAYMENT_NEW: "/admin/payments/new",
    MACHINES: "/admin/machines",
    SALES: "/admin/sales",
    REPORTS: "/admin/reports",
    SETTINGS: "/admin/settings",
    SUPPORT: "/admin/support",
    FEES: "/admin/fees",
    USER_MANAGEMENT: "/admin/user-management",
    NOTIFICATIONS: "/admin/notifications",
    LOGISTICS: "/admin/logistics", // Redirect to logistics dashboard
  },
  
  // Financial routes
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    PAYMENT_DETAILS: (id = ":id") => `/financial/payments/${id}`,
    PAYMENT_NEW: "/financial/payments/new",
    CLIENTS: "/financial/clients",
    REPORTS: "/financial/reports",
    SETTINGS: "/financial/settings",
    EXPENSES: "/financial/expenses",
    REVENUE: "/financial/revenue",
  },

  // Logistics routes
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    MACHINE_NEW: "/logistics/machines/new",
    MACHINE_DETAILS: (id = ":id") => `/logistics/machines/${id}`,
    OPERATIONS: "/logistics/operations",
    REQUESTS: "/logistics/requests",
    INVENTORY: "/logistics/inventory",
    SETTINGS: "/logistics/settings",
    CLIENTS: "/logistics/clients",
    REPORTS: "/logistics/reports",
  },
  
  // Partner routes
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    CLIENT_DETAILS: (id = ":id") => `/partner/clients/${id}`,
    COMMISSIONS: "/partner/commissions",
    REPORTS: "/partner/reports",
    SETTINGS: "/partner/settings",
    SALES: "/partner/sales",
  },
  
  // Client Management
  CLIENT: {
    NEW: "/client/new",
    DETAILS: (id = ":id") => `/clients/${id}`,
    DASHBOARD: (id = ":id") => `/client/${id}/dashboard`,
    PAYMENTS: (id = ":id") => `/client/${id}/payments`,
  },
  
  // Partner Management
  PARTNERS: {
    NEW: "/partners/new",
    DETAILS: (id = ":id") => `/partners/${id}`,
  },
  
  // Common routes
  HOME: "/",
  DASHBOARD: "/dashboard",
  CLIENTS: "/clients",
  PAYMENTS: "/payments",
  SUPPORT: "/support",
  SETTINGS: "/settings",
  NOTIFICATIONS: "/notifications",
  
  // 404 Not Found
  NOT_FOUND: "*",
};
