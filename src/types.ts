
// Add SalesChartData for reference
export interface SalesChartData {
  date?: string;
  amount: number;
  method: PaymentMethod; // Changed from optional to required
  percentage: number; // Changed from optional to required
  name?: string; // Added name property for chart compatibility
  value?: number; // Added value property for chart compatibility
}
