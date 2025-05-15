
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string; // Add className prop
}

export function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}
