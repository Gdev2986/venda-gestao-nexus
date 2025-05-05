
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PROFILE: "/profile",
  DASHBOARD: "/dashboard", // Add generic dashboard path
  NOT_FOUND: "*", // Add not found path
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    SALES: "/admin/sales",
    SALES_NEW: "/admin/sales/new", // Add sales new path
    SALES_DETAILS: (id: string = ":id") => `/admin/sales/${id}`, // Add sales details path with optional param
    CLIENTS: "/admin/clients",
    CLIENT_DETAILS: (id: string = ":id") => `/admin/clients/${id}`,
    CLIENT_EDIT: (id: string = ":id") => `/admin/clients/${id}/edit`,
    CLIENT_NEW: "/admin/clients/new",
    PARTNERS: "/admin/partners",
    PARTNER_DETAILS: (id: string = ":id") => `/admin/partners/${id}`,
    PARTNER_EDIT: (id: string = ":id") => `/admin/partners/${id}/edit`,
    PARTNER_NEW: "/admin/partners/new",
    LOGISTICS: "/admin/logistics",
    LOGISTICS_MODULE: "/admin/logistics/module",
    REPORTS: "/admin/reports",
    FEES: "/admin/fees",
    SUPPORT: "/admin/support",
    HELP: "/admin/help",
    SETTINGS: "/admin/settings",
    USERS: "/admin/users",
    USER_MANAGEMENT: "/admin/users/management", // Add user management path
    USER_DETAILS: (id: string = ":id") => `/admin/users/${id}`,
    USER_EDIT: (id: string = ":id") => `/admin/users/${id}/edit`,
    USER_NEW: "/admin/users/new",
    MACHINES: "/admin/machines",
    MACHINE_DETAILS: (id: string = ":id") => `/admin/machines/${id}`,
    MACHINE_EDIT: (id: string = ":id") => `/admin/machines/${id}/edit`,
    MACHINE_NEW: "/admin/machines/new",
    PAYMENTS: "/admin/payments",
    PAYMENT_DETAILS: (id: string = ":id") => `/admin/payments/${id}`,
    PAYMENT_NEW: "/admin/payments/new",
  },
  USER: {
    DASHBOARD: "/user/dashboard",
    PAYMENTS: "/user/payments",
    MACHINES: "/user/machines", // Add machines path
    SUPPORT: "/user/support",
    HELP: "/user/help",
    SETTINGS: "/user/settings",
  },
  PARTNER: {
    DASHBOARD: "/partner/dashboard",
    SALES: "/partner/sales",
    CLIENTS: "/partner/clients",
    CLIENT_DETAILS: (id: string = ":id") => `/partner/clients/${id}`, // Add client details path
    REPORTS: "/partner/reports",
    SUPPORT: "/partner/support",
    HELP: "/partner/help",
    SETTINGS: "/partner/settings",
    COMMISSIONS: "/partner/commissions", // Add commissions path
  },
  FINANCIAL: {
    DASHBOARD: "/financial/dashboard",
    SALES: "/financial/sales",
    CLIENTS: "/financial/clients",
    CLIENT_DETAILS: (id: string = ":id") => `/financial/clients/${id}`, // Add client details path
    PAYMENTS: "/admin/payments", // Share the same route
    PARTNERS: "/financial/partners",
    REPORTS: "/financial/reports",
    FEES: "/financial/fees",
    SUPPORT: "/financial/support",
    HELP: "/financial/help",
    SETTINGS: "/financial/settings",
    REQUESTS: "/financial/requests", // Add requests path
  },
  LOGISTICS: {
    DASHBOARD: "/logistics/dashboard",
    CLIENTS: "/logistics/clients",
    MACHINES: "/logistics/machines",
    MACHINE_NEW: "/logistics/machines/new", // Add machine new path
    SALES: "/logistics/sales",
    LOGISTICS_MODULE: "/logistics/module",
    SUPPORT: "/logistics/support",
    HELP: "/logistics/help",
    SETTINGS: "/logistics/settings",
  }
};
