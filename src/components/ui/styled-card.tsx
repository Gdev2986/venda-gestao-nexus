
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StyledCardProps {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  borderColor?: string;
  cardClassName?: string;
}

export function StyledCard({
  title,
  description,
  children,
  className,
  icon,
  borderColor = "border-l-primary",
  cardClassName = "",
}: StyledCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor} ${cardClassName}`}>
      <CardHeader className={`pb-2 ${className}`}>
        {(title || icon) && (
          <div className="flex justify-between items-center">
            {title && (
              <div>
                {typeof title === "string" ? (
                  <CardTitle className="text-sm font-medium">{title}</CardTitle>
                ) : (
                  title
                )}
              </div>
            )}
            {icon && <div className="p-2 bg-muted/30 rounded-md">{icon}</div>}
          </div>
        )}
        {description && (
          <CardDescription>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
