
import { PaymentStatus } from "./index";

export interface PaymentData {
  id: string;
  amount: number;
  approved_at: string | null;
  approved_by: string | null;
  client_id: string;
  created_at: string;
  description: string;
  pix_key_id: string;
  receipt_url: string | null;
  status: PaymentStatus;
  updated_at: string;
  rejection_reason: string | null;
  pix_key: {
    id: string;
    key: string;
    type: string;
    name: string;
  };
  client: {
    id: string;
    business_name: string;
    email: string;
  };
}

export interface UsePaymentsOptions {
  fetchOnMount?: boolean;
  statusFilter?: PaymentStatus | "ALL";
  searchTerm?: string;
  pageSize?: number;
}

export interface UsePaymentsResult {
  payments: PaymentData[];
  isLoading: boolean;
  error: Error | null;
  fetchPayments: () => Promise<void>;
  approvePayment: (paymentId: string, receiptUrl?: string | null) => Promise<boolean>;
  rejectPayment: (paymentId: string, rejectionReason: string) => Promise<boolean>;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export { PaymentStatus } from "./index";
