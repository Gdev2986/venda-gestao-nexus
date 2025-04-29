
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sale, SaleDb, PaymentMethod, SalesFilterParams } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { addDays, endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, subDays } from "date-fns";

interface DateRange {
  from: Date;
  to?: Date;
}

interface SalesTotals {
  grossAmount: number;
  netAmount: number;
  count: number;
}

interface PaymentMethodSummary {
  method: PaymentMethod;
  amount: number;
  percentage: number;
}

// Define a more specific database type for Sales
interface SalesDbResponse {
  id: string;
  code: string;
  date: string;
  terminal: string;
  gross_amount: number;
  net_amount: number;
  payment_method: string;
  client_id: string;
  machine_id?: string;
  partner_id?: string;
  processing_status?: string;
  created_at?: string;
  updated_at?: string;
}

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [totals, setTotals] = useState<SalesTotals>({
    grossAmount: 0,
    netAmount: 0,
    count: 0,
  });
  const [paymentMethodSummary, setPaymentMethodSummary] = useState<PaymentMethodSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SalesFilterParams>({});
  const [date, setDate] = useState<DateRange | undefined>();
  const { toast } = useToast();

  // Fetch sales from Supabase
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      // Get the current user's client ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user");
      }
      
      // Get the client ID for this user
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .single();
        
      if (clientError) {
        throw clientError;
      }
      
      let query = supabase.from("sales").select("*");
      
      // Filter by client ID if the user is a client
      if (clientData) {
        query = query.eq("client_id", clientData.id);
      }
      
      const { data, error } = await query.order("date", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Convert database sales to application Sale type
        const formattedSales: Sale[] = data.map((saleDb: SalesDbResponse) => ({
          id: saleDb.id,
          code: saleDb.code,
          date: new Date(saleDb.date),
          terminal: saleDb.terminal,
          grossAmount: saleDb.gross_amount,
          netAmount: saleDb.net_amount,
          paymentMethod: saleDb.payment_method as PaymentMethod,
          clientId: saleDb.client_id
        }));
        
        setSales(formattedSales);
        applyFilters(formattedSales, filters, date);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({
        title: "Error",
        description: "Não foi possível carregar as vendas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply filters to sales
  const applyFilters = (salesData: Sale[], filtersToApply: SalesFilterParams, dateRange?: DateRange) => {
    let result = [...salesData];
    
    // Apply payment method filter
    if (filtersToApply.paymentMethod && filtersToApply.paymentMethod !== 'all') {
      result = result.filter(sale => sale.paymentMethod === filtersToApply.paymentMethod);
    }
    
    // Apply terminal filter
    if (filtersToApply.terminal && filtersToApply.terminal !== 'all') {
      result = result.filter(sale => sale.terminal === filtersToApply.terminal);
    }
    
    // Apply search filter
    if (filtersToApply.search) {
      result = result.filter(sale => 
        sale.code.toLowerCase().includes(filtersToApply.search!.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateRange?.from) {
      const startDate = startOfDay(dateRange.from);
      const endDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
      
      result = result.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= startDate && saleDate <= endDate;
      });
    }
    
    // Calculate totals
    const totals = calculateTotals(result);
    setTotals(totals);
    
    // Calculate payment method summary
    const summary = calculatePaymentMethodSummary(result);
    setPaymentMethodSummary(summary);
    
    // Update filtered sales
    setFilteredSales(result);
  };
  
  // Calculate totals
  const calculateTotals = (salesData: Sale[]): SalesTotals => {
    return salesData.reduce(
      (acc, sale) => {
        acc.grossAmount += sale.grossAmount;
        acc.netAmount += sale.netAmount;
        acc.count += 1;
        return acc;
      },
      { grossAmount: 0, netAmount: 0, count: 0 }
    );
  };
  
  // Calculate payment method summary
  const calculatePaymentMethodSummary = (salesData: Sale[]): PaymentMethodSummary[] => {
    const methods = Object.values(PaymentMethod);
    const summary: Record<PaymentMethod, number> = methods.reduce(
      (acc, method) => ({ ...acc, [method]: 0 }),
      {} as Record<PaymentMethod, number>
    );
    
    // Calculate total for each payment method
    salesData.forEach((sale) => {
      summary[sale.paymentMethod] += sale.netAmount;
    });
    
    // Calculate total amount
    const totalAmount = Object.values(summary).reduce((sum, amount) => sum + amount, 0);
    
    // Create summary array with percentages
    return methods
      .map((method) => ({
        method,
        amount: summary[method],
        percentage: totalAmount ? Math.round((summary[method] / totalAmount) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  };
  
  // Handle filter changes
  const handleFilterChange = (key: keyof SalesFilterParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(sales, newFilters, date);
  };
  
  // Handle date changes
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    applyFilters(sales, filters, newDate);
  };
  
  // Handle quick filters (yesterday, week, month)
  const handleQuickFilter = (filter: 'yesterday' | 'week' | 'month') => {
    const today = new Date();
    let newDate: DateRange;
    
    switch (filter) {
      case 'yesterday':
        const yesterday = subDays(today, 1);
        newDate = {
          from: startOfDay(yesterday),
          to: endOfDay(yesterday)
        };
        break;
        
      case 'week':
        newDate = {
          from: startOfWeek(today, { weekStartsOn: 1 }), // Week starts on Monday
          to: endOfWeek(today, { weekStartsOn: 1 })
        };
        break;
        
      case 'month':
        newDate = {
          from: startOfMonth(today),
          to: endOfMonth(today)
        };
        break;
    }
    
    setDate(newDate);
    applyFilters(sales, filters, newDate);
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setDate(undefined);
    applyFilters(sales, {}, undefined);
  };

  // Set up realtime subscription
  useEffect(() => {
    fetchSales();
    
    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales',
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Refresh data when changes occur
          fetchSales();
          
          // Show notification
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nova venda registrada",
              description: "Uma nova venda foi registrada no sistema.",
            });
          }
        }
      )
      .subscribe();
      
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    sales: filteredSales,
    isLoading,
    filters,
    date,
    totals,
    paymentMethodSummary,
    handleFilterChange,
    handleDateChange,
    handleQuickFilter,
    clearFilters,
    fetchSales
  };
};
