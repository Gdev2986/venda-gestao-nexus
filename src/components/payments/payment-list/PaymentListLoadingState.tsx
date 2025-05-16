
import { Skeleton } from "@/components/ui/skeleton";

export const PaymentListLoadingState = () => {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-40" />
          <div className="flex-1" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="border-t">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
            <Skeleton className="h-4 w-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex-1" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-24" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
