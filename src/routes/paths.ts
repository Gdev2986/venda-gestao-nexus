
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENT_DETAILS: (id = ":id") => `/admin/clients/${id}`,
    CLIENT_NEW: "/admin/clients/new",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: (id = ":id") => `/admin/partners/${id}`,
    PARTNER_NEW: "/admin/partners/new",
    MACHINES: "/admin/machines",
    MACHINE_DETAILS: (id = ":id") => `/admin/machines/${id}`,
    MACHINE_NEW: "/admin/machines/new",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id = ":id") => `/admin/payments/${id}`,
    SALES: "/admin/sales",
    SALE_DETAILS: (id = ":id") => `/admin/sales/${id}`,
    SALE_NEW: "/admin/sales/new",
    SETTINGS: "/admin/settings",
    FEES: "/admin/fees",
    REPORTS: "/admin/reports",
    SUPPORT: "/admin/support",
    USER_MANAGEMENT: "/admin/user-management",
    NOTIFICATIONS: "/admin/notifications",
    LOGISTICS: "/admin/logistics"
  },

  USER: {
    DASHBOARD: "/user/dashboard",
    MACHINES: "/user/machines",
    PAYMENTS: "/user/payments",
    SETTINGS: "/user/settings",
    SUPPORT: "/user/support",
    HELP: "/user/help"
  },

  CLIENT: {
    DASHBOARD: "/client/dashboard",
    MACHINES: "/client/machines",
    PAYMENTS: "/client/payments",
    SETTINGS: "/client/settings",
    SUPPORT: "/client/support"
  },

  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    CLIENT_DETAILS: (id = ":id") => `/partner/clients/${id}`,
    COMMISSIONS: "/partner/commissions",
    SALES: "/partner/sales",
    REPORTS: "/partner/reports",
    SETTINGS: "/partner/settings",
    SUPPORT: "/partner/support",
    HELP: "/partner/help"
  },

  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    CLIENTS: "/financial/clients",
    REPORTS: "/financial/reports",
    SETTINGS: "/financial/settings"
  },

  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    MACHINE_DETAILS: (id = ":id") => `/logistics/machines/${id}`,
    MACHINE_NEW: "/logistics/machines/new",
    OPERATIONS: "/logistics/operations",
    INVENTORY: "/logistics/inventory",
    REQUESTS: "/logistics/requests",
    CALENDAR: "/logistics/calendar",
    STOCK: "/logistics/stock",
    CLIENT_MACHINES: "/logistics/client-machines",
    SETTINGS: "/logistics/settings",
    SUPPORT: "/logistics/support",
    CLIENTS: "/logistics/clients"
  }
};
