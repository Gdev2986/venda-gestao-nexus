
// Paths for auth routes
export const AUTH_PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
};

// Paths for admin routes
export const ADMIN_PATHS = {
  DASHBOARD: "/admin",
  CLIENTS: "/admin/clients",
  CLIENT_DETAILS: (id: string) => `/admin/clients/${id}`,
  CLIENT_NEW: "/admin/clients/new",
  MACHINES: "/admin/machines",
  MACHINE_DETAILS: (id: string) => `/admin/machines/${id}`,
  MACHINE_NEW: "/admin/machines/new",
  PARTNERS: "/admin/partners",
  PARTNER_DETAILS: (id: string) => `/admin/partners/${id}`,
  PARTNER_NEW: "/admin/partners/new",
  PAYMENTS: "/admin/payments",
  PAYMENT_DETAILS: (id: string) => `/admin/payments/${id}`,
  SETTINGS: "/admin/settings",
  SUPPORT: "/admin/support",
  USER_MANAGEMENT: "/admin/users",
  NOTIFICATIONS: "/admin/notifications",
  REPORTS: "/admin/reports",
  FEES: "/admin/fees",
  SALES: "/admin/sales",
};

// Paths for user routes
export const USER_PATHS = {
  DASHBOARD: "/dashboard",
  PAYMENTS: "/payments",
  MACHINES: "/machines",
  SUPPORT: "/support",
  HELP: "/help",
  SETTINGS: "/settings",
};

// Paths for logistics routes
export const LOGISTICS_PATHS = {
  DASHBOARD: "/logistics",
  MACHINES: "/logistics/machines",
  CLIENT_MACHINES: "/logistics/client-machines",
  INVENTORY: "/logistics/inventory",
  REQUESTS: "/logistics/requests",
  OPERATIONS: "/logistics/operations",
  SUPPORT: "/logistics/support",
  SETTINGS: "/logistics/settings",
  CALENDAR: "/logistics/calendar",
  CLIENTS: "/logistics/clients",
};

// Paths for financial routes
export const FINANCIAL_PATHS = {
  DASHBOARD: "/financial",
  PAYMENTS: "/financial/payments",
  REPORTS: "/financial/reports",
  SETTINGS: "/financial/settings",
};

// Paths for partner routes
export const PARTNER_PATHS = {
  DASHBOARD: "/partner",
  CLIENTS: "/partner/clients",
  CLIENT_DETAILS: (id: string) => `/partner/clients/${id}`,
  COMMISSIONS: "/partner/commissions",
  REPORTS: "/partner/reports",
  SALES: "/partner/sales",
  SETTINGS: "/partner/settings",
  SUPPORT: "/partner/support",
  HELP: "/partner/help",
};

// Combined paths for easier access
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  DASHBOARD: "/dashboard",
  ADMIN: ADMIN_PATHS,
  USER: USER_PATHS,
  FINANCIAL: FINANCIAL_PATHS,
  LOGISTICS: LOGISTICS_PATHS,
  PARTNER: PARTNER_PATHS,
};
