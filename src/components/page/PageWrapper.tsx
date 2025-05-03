
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}
