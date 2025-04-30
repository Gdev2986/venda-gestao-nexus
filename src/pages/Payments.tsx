
import { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";

const Payments = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Payments</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            <p>Payment content will be displayed here.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Payments;
