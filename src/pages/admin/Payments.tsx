
  // Add this function that's referenced but not defined in the code
  const handleViewPayment = (payment: PaymentRequest) => {
    setSelectedPayment(payment as unknown as Payment);
    setDetailsDialogOpen(true);
  };
