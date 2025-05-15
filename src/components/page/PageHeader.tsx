
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  actionOnClick?: () => void;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionLink,
  actionOnClick,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
      {actionLabel && (actionLink || actionOnClick) && (
        actionOnClick ? (
          <Button onClick={actionOnClick}>{actionLabel}</Button>
        ) : (
          <Button asChild>
            <Link to={actionLink!}>{actionLabel}</Link>
          </Button>
        )
      )}
    </div>
  );
}
