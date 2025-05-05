
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  onActionClick?: () => void;
  children?: ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  actionLabel, 
  actionLink,
  onActionClick,
  children
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
      {actionLabel && (actionLink || onActionClick) && (
        <Button asChild={!!actionLink} onClick={onActionClick || undefined}>
          {actionLink ? (
            <Link to={actionLink}>
              {actionLabel}
            </Link>
          ) : (
            actionLabel
          )}
        </Button>
      )}
    </div>
  );
}
