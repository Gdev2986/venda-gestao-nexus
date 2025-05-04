
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  
  USER: {
    DASHBOARD: "/user/dashboard",
    MACHINES: "/user/machines",
    PAYMENTS: "/user/payments",
    SUPPORT: "/user/support",
  },
  
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENT_NEW: "/admin/clients/new",
    CLIENT_DETAILS: (id: string) => `/admin/clients/${id}`,
    MACHINES: "/admin/machines",
    MACHINE_NEW: "/admin/machines/new",
    MACHINE_DETAILS: (id: string) => `/admin/machines/${id}`,
    PARTNERS: "/admin/partners",
    PARTNER_NEW: "/admin/partners/new",
    PARTNER_DETAILS: (id: string) => `/admin/partners/${id}`,
    SETTINGS: "/admin/settings",
    NOTIFICATIONS: "/admin/notifications",
    PAYMENTS: "/admin/payments",
    PAYMENT_NEW: "/admin/payments/new",
    PAYMENT_DETAILS: (id: string) => `/admin/payments/${id}`,
    REPORTS: "/admin/reports",
    FEES: "/admin/fees",
    SALES: "/admin/sales",
    SALES_NEW: "/admin/sales/new",
    USER_MANAGEMENT: "/admin/settings/users",
  },
  
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    COMMISSIONS: "/partner/commissions",
    SETTINGS: "/partner/settings",
    SALES: "/partner/sales",
  },
  
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    REPORTS: "/financial/reports",
    REQUESTS: "/financial/requests",
    CLIENTS: "/financial/clients",
    PARTNERS: "/financial/partners",
  },
  
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    OPERATIONS: "/logistics/operations",
    SUPPORT: "/logistics/support",
    LOGISTICS_MODULE: "/logistics/module",
    MACHINE_NEW: "/logistics/machines/new",
  },
};
