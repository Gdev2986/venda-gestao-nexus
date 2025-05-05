
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  children?: ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  actionLabel, 
  actionLink,
  children
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        {children}
        {actionLabel && actionLink && (
          <Button asChild>
            <Link to={actionLink}>{actionLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
