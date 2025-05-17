
// This is a partial update to fix the type issues in ClientPayments.tsx
// Changing the toast variant from "success" to "default"
// And fixing the handleRequestPayment type

// Function to handle payment requests
const handleRequestPayment = async (amount: number, description: string, pixKeyId: string) => {
  // Convert amount to string if needed by existing implementation
  return await requestPayment(amount.toString(), description, pixKeyId);
};

// Update the toast variant
toast({
  variant: "default", // Changed from "success" to "default"
  title: "Sucesso",
  description: "Pagamento solicitado com sucesso"
});
