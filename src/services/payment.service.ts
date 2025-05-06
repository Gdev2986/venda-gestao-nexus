import { PaymentData } from "@/types/payment.types";
import { PaymentRequestStatus, PaymentStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Simulate payment data fetching
export const fetchPaymentsData = async (
  statusFilter: PaymentStatus | "ALL" = "ALL",
  searchTerm: string = ""
): Promise<PaymentData[]> => {
  try {
    console.log("Fetching payments with status:", statusFilter, "and search term:", searchTerm);
    
    // Return mock data based on the filter
    return Promise.resolve([
      {
        id: "1",
        amount: 1500,
        description: "Pagamento mensal",
        status: "PENDING",
        created_at: "2023-01-15T10:30:00Z",
        updated_at: "2023-01-15T10:30:00Z",
        client_id: "c1",
        pix_key_id: "pk1",
        receipt_url: null,
        approved_at: null,
        approved_by: null,
        rejection_reason: null,
        pix_key: {
          id: "pk1",
          key: "example@email.com",
          key_type: "EMAIL",
          client_id: "c1",
          created_at: "2022-12-01T00:00:00Z",
          updated_at: "2022-12-01T00:00:00Z"
        },
        client: {
          id: "c1",
          business_name: "Empresa ABC",
          document: "12345678901"
        }
      },
      {
        id: "2",
        amount: 2500,
        description: "Serviços extras",
        status: "APPROVED",
        created_at: "2023-01-10T14:20:00Z",
        updated_at: "2023-01-12T09:15:00Z",
        client_id: "c2",
        pix_key_id: "pk2",
        receipt_url: "https://example.com/receipt.pdf",
        approved_at: "2023-01-12T09:15:00Z",
        approved_by: "admin1",
        rejection_reason: null,
        pix_key: {
          id: "pk2",
          key: "98765432100",
          key_type: "CPF",
          client_id: "c2",
          created_at: "2022-11-15T00:00:00Z",
          updated_at: "2022-11-15T00:00:00Z"
        },
        client: {
          id: "c2",
          business_name: "Empresa XYZ",
          document: "98765432100"
        }
      },
      {
        id: "3",
        amount: 1800,
        description: "Consultoria",
        status: "REJECTED",
        created_at: "2023-01-08T11:45:00Z",
        updated_at: "2023-01-09T16:30:00Z",
        client_id: "c3",
        pix_key_id: "pk3",
        receipt_url: null,
        approved_at: null,
        approved_by: null,
        rejection_reason: "Informações incorretas",
        pix_key: {
          id: "pk3",
          key: "+5511987654321",
          key_type: "PHONE",
          client_id: "c3",
          created_at: "2022-10-20T00:00:00Z",
          updated_at: "2022-10-20T00:00:00Z"
        },
        client: {
          id: "c3",
          business_name: "Empresa 123",
          document: "45678912300"
        }
      }
    ].filter((payment) => {
      // Filter by status if not ALL
      const statusMatch = statusFilter === "ALL" || payment.status === statusFilter;
      
      // Filter by search term if provided
      const searchMatch = !searchTerm || 
        payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.client.business_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && searchMatch;
    }));
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw new Error("Failed to fetch payments");
  }
};

// Approve a payment request
export const approvePaymentRequest = async (
  paymentId: string,
  receiptUrl?: string
): Promise<boolean> => {
  try {
    console.log("Approving payment:", paymentId, "with receipt:", receiptUrl);
    
    // In a real implementation, this would update the database
    // For now, just simulate a successful operation
    return Promise.resolve(true);
  } catch (error) {
    console.error("Error approving payment:", error);
    throw new Error("Failed to approve payment");
  }
};

// Reject a payment request
export const rejectPaymentRequest = async (
  paymentId: string,
  reason: string
): Promise<boolean> => {
  try {
    console.log("Rejecting payment:", paymentId, "with reason:", reason);
    
    // In a real implementation, this would update the database
    // For now, just simulate a successful operation
    return Promise.resolve(true);
  } catch (error) {
    console.error("Error rejecting payment:", error);
    throw new Error("Failed to reject payment");
  }
};

// Format payment request data
export const formatPaymentRequest = (data: any): PaymentData => {
  // Ensure rejection_reason is always present, even if null
  return {
    ...data,
    status: data.status as PaymentRequestStatus,
    rejection_reason: data.rejection_reason || null,
    payment_type: data.payment_type || "PIX" // Set default payment_type for compatibility
  };
};

// Set up real-time subscription for payment updates
export const setupPaymentSubscription = (
  onUpdate: () => void
) => {
  console.log("Setting up payment subscription");
  
  // In a real implementation, this would set up a real-time subscription
  // For now, just return a mock subscription object
  return {
    unsubscribe: () => {
      console.log("Unsubscribing from payment updates");
    }
  };
};
