
import { useState, useEffect } from 'react';
import { Payment, PaymentStatus } from '@/types/payment.types';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: "1",
        client_id: "client-1",
        amount: 1000,
        description: "Payment",
        status: PaymentStatus.APPROVED,
        method: "PIX" as any,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        requested_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        approved_by: "admin-1",
        receipt_url: "",
        rejection_reason: "",
        pix_key: {
          id: "pix-1",
          user_id: "user-1",
          type: "EMAIL" as any,
          key: "test@example.com",
          name: "Test Key",
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    ];

    setTimeout(() => {
      setPayments(mockPayments);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { payments, isLoading };
};
