

export const PATHS = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
  HOME: '/',
  
  ADMIN_DASHBOARD: '/admin/dashboard',
  CLIENT_DASHBOARD: '/client/dashboard',
  LOGISTICS_DASHBOARD: '/logistics/dashboard',
  PARTNER_DASHBOARD: '/partner/dashboard',
  USER_DASHBOARD: '/user/dashboard',
  
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    SALES: '/admin/sales',
    SALES_DETAILS: (id?: string) => id ? `/admin/sales/${id}` : '/admin/sales/:id',
    SALES_NEW: '/admin/sales/new',
    PAYMENTS: '/admin/payments',
    PAYMENT_DETAILS: (id?: string) => id ? `/admin/payments/${id}` : '/admin/payments/:id',
    PAYMENT_NEW: '/admin/payments/new',
    CLIENTS: '/admin/clients',
    CLIENT_DETAILS: (id?: string) => id ? `/admin/clients/${id}` : '/admin/clients/:id',
    PARTNERS: '/admin/partners',
    PARTNERS_NEW: '/admin/partners/new',
    PARTNER_DETAILS: (id?: string) => id ? `/admin/partners/${id}` : '/admin/partners/:id',
    MACHINES: '/admin/machines',
    COMPANY: '/admin/company',
    COMPANY_REPORTS: '/admin/company/reports',
    COMPANY_EXPENSES: '/admin/company/expenses',
    FEES: '/admin/fees',
    SUPPORT: '/admin/support',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings'
  },
  
  CLIENT: {
    DASHBOARD: '/client/dashboard',
    MACHINES: '/client/machines',
    PAYMENTS: '/client/payments',
    SUPPORT: '/client/support',
    HELP: '/client/help',
    SETTINGS: '/client/settings'
  },
  
  PARTNER: {
    DASHBOARD: '/partner/dashboard',
    SALES: '/partner/sales',
    CLIENTS: '/partner/clients',
    COMMISSIONS: '/partner/commissions',
    REPORTS: '/partner/reports',
    SUPPORT: '/partner/support',
    HELP: '/partner/help',
    SETTINGS: '/partner/settings'
  },
  
  LOGISTICS: {
    DASHBOARD: '/logistics/dashboard',
    MACHINES: '/logistics/machines',
    MACHINE_DETAILS: (id?: string) => id ? `/logistics/machines/${id}` : '/logistics/machines/:id',
    OPERATIONS: '/logistics/operations',
    REQUESTS: '/logistics/requests',
    REPORTS: '/logistics/reports',
    CLIENTS: '/logistics/clients',
    SETTINGS: '/logistics/settings'
  },
  
  FINANCIAL: {
    DASHBOARD: '/financial/dashboard',
    REQUESTS: '/financial/requests',
    CLIENTS: '/financial/clients',
    PAYMENTS: '/financial/payments',
    REPORTS: '/financial/reports',
    SETTINGS: '/financial/settings'
  },
  
  USER: {
    DASHBOARD: '/user/dashboard'
  }
};

