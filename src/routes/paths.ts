export const PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  
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
    PARTNERS: "/admin/partners",
    SETTINGS: "/admin/settings",
    NOTIFICATIONS: "/admin/notifications",
    PAYMENTS: "/admin/payments",
    REPORTS: "/admin/reports",
    FEES: "/admin/fees",
    SALES: "/admin/sales",
    USER_MANAGEMENT: "/admin/settings/users",
  },
  
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    COMMISSIONS: "/partner/commissions",
    SETTINGS: "/partner/settings",
  },
  
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    REPORTS: "/financial/reports",
    REQUESTS: "/financial/requests",
  },
  
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    OPERATIONS: "/logistics/operations",
    SUPPORT: "/logistics/support",
  },
};
