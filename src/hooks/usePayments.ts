import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus, PaymentType } from "@/types";

interface FilterOptions {
  searchTerm?: string;
  status?: PaymentStatus | "ALL";
  dateRange?: { from: Date; to?: Date };
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  // Function to fetch payments from Supabase
  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("payment_requests")
        .select(`
          *,
          client: client_id (business_name)
        `)
        .order("created_at", { ascending: false });

      // Apply filters
      if (filterOptions.searchTerm) {
        query = query.ilike("id", `%${filterOptions.searchTerm}%`);
      }

      if (filterOptions.status && filterOptions.status !== "ALL") {
        query = query.eq("status", filterOptions.status);
      }

      if (filterOptions.dateRange?.from) {
        const fromDate = filterOptions.dateRange.from.toISOString().split('T')[0];
        query = query.gte("created_at", fromDate);
      }

      if (filterOptions.dateRange?.to) {
        const toDate = filterOptions.dateRange.to.toISOString().split('T')[0];
        query = query.lte("created_at", toDate);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Transform the data to match our Payment type
        const transformedPayments = data.map(transformPaymentData);
        setPayments(transformedPayments);
      } else {
        setPayments([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filterOptions]);

  // Function to update filter options
  const updateFilterOptions = (newOptions: FilterOptions) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      ...newOptions,
    }));
  };

  // Transform raw database records to Payment objects
  const transformPaymentData = (data: any): Payment => {
    return {
      id: data.id,
      amount: data.amount,
      status: data.status as PaymentStatus,
      created_at: data.created_at,
      updated_at: data.updated_at,
      client_id: data.client_id,
      approved_at: data.approved_at,
      receipt_url: data.receipt_url,
      client_name: data.client?.business_name || "Cliente desconhecido",
      payment_type: data.payment_type || PaymentType.PIX,
      rejection_reason: data.rejection_reason || null,
      bank_info: data.bank_info,
      document_url: data.document_url
    };
  };

  return {
    payments,
    isLoading,
    error,
    updateFilterOptions,
    fetchPayments,
  };
}
