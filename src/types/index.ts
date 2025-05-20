// Re-export from enums
export {
  UserRole,
  PaymentStatus,
  PaymentType,
  ClientStatus,
  PaymentMethod,
  MachineStatus,
  TicketStatus,
  TicketType,
  PaymentAction,
  SupportRequestStatus,
  SupportRequestType,
  SupportRequestPriority,
  TicketPriority
} from './enums';

// Re-export from notification.types
export {
  NotificationType,
  type Notification
} from './notification.types';

// Re-export from payment.types
export {
  type PixKey,
  type PixKeyType,
  type Payment,
  type PaymentRequest,
  type PaymentRequestStatus
} from './payment.types';

// Re-export from client.ts
export {
  type SupabaseClientRow,
  type ClientCreate,
  type ClientUpdate,
  type Client
} from './client';

// Re-export from machine.types
export {
  type Machine,
  type MachineStats,
  type MachineTransfer,
  type MachineTransferParams,
  type MachineCreateParams,
  type MachineUpdateParams
} from './machine.types';

// Re-export from support.types 
export {
  type SupportTicket,
  type CreateSupportTicketParams,
  type UpdateSupportTicketParams
} from './support.types';

// Re-export from support-ticket.types
export {
  type SupportTicket as SupportTicketType
} from './support-ticket.types';

// Re-export from support-request.types
export {
  type SupportRequest
} from './support-request.types';

// Define Partner interface
export interface Partner {
  id: string;
  company_name: string;
  created_at: string;
  updated_at: string;
  commission_rate: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  business_name?: string; // For backward compatibility
  email?: string; // Added for consistency with filtering
  phone?: string; // Added for consistency with filtering
  address?: string; // Added for completeness
  status?: string; // Added to fix type error in PartnersTable
  total_sales?: number;
  total_commission?: number;
  fee_plan_id?: string; // Added for fee plan relationship
}

// Sale interface
export interface Sale {
  id: string;
  code: string;
  terminal: string;
  client_name: string;
  gross_amount: number;
  net_amount: number;
  date: string;
  payment_method: string;
  client_id: string;
  created_at: string;
  updated_at: string;
  amount?: number;
  status?: string;
  partner_id?: string;
  machine_id?: string;
  processing_status?: string;
}

export interface FilterValues {
  search?: string;
  status?: string;
  category?: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
  searchTerm?: string;
  commissionRange?: [number, number];
}

export interface SalesFilterParams {
  search?: string;
  paymentMethod?: string;
  terminal?: string;
  minAmount?: number;
  maxAmount?: number;
  startHour?: number;
  endHour?: number;
  installments?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string; 
  created_at: string;
  status: string;
}

export interface SalesChartData {
  name: string;
  value: number;
}

/**
 * Format a number as Brazilian currency (BRL)
 * @param value The value to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Format a number with thousand separators
 * @param value The value to format
 * @returns Formatted number string with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Format a percentage value
 * @param value The value to format (e.g. 0.12 for 12%)
 * @param showPlusSign Whether to show a plus sign for positive values
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, showPlusSign = false): string => {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
  
  return value > 0 && showPlusSign ? `+${formatted}` : formatted;
};

/**
 * Format a commission block/plan name for display
 * @param name The name of the commission block/plan
 * @returns Formatted commission block/plan name
 */
export const formatCommissionPlan = (name: string): string => {
  return name || 'Plano Padrão';
};
