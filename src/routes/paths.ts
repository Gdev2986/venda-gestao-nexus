
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  UNAUTHORIZED: "/unauthorized",
  NOT_FOUND: "/404",
  
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CLIENTS: "/admin/clients",
    CLIENTS_NEW: "/admin/clients/new",
    CLIENT_DETAILS: (id?: string) => id ? `/admin/clients/${id}` : "/admin/clients/:id",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: (id?: string) => id ? `/admin/partners/${id}` : "/admin/partners/:id",
    PARTNER_CLIENTS: (id?: string) => id ? `/admin/partners/${id}/clients` : "/admin/partners/:id/clients",
    PARTNERS_NEW: "/admin/partners/new",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id?: string) => id ? `/admin/payments/${id}` : "/admin/payments/:id",
    SALES: "/admin/sales",
    SALES_DETAILS: (id?: string) => id ? `/admin/sales/${id}` : "/admin/sales/:id",
    SALES_NEW: "/admin/sales/new",
    MACHINES: "/admin/machines",
    FEES: "/admin/fees",
    REPORTS: "/admin/reports",
    SETTINGS: "/admin/settings",
    NOTIFICATIONS: "/admin/notifications",
    SUPPORT: "/admin/support",
    SECURITY: "/admin/security",
    COMPANY: "/admin/company"
  },
  
  CLIENT: {
    DASHBOARD: "/client/dashboard",
    PAYMENTS: "/client/payments",
    SUPPORT: "/client/support"
  },
  
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    CLIENTS: "/partner/clients",
    COMMISSIONS: "/partner/commissions"
  },
  
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    PAYMENTS: "/financial/payments",
    REPORTS: "/financial/reports"
  },
  
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    MACHINES: "/logistics/machines",
    REQUESTS: "/logistics/requests"
  }
} as const;
