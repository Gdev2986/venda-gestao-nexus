
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export function PageHeader({ 
  title, 
  description, 
  actionLabel, 
  actionLink,
  onActionClick
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
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
