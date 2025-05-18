
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actionLabel?: string;
  actionLink?: string;
  actionOnClick?: () => void;
  action?: React.ReactNode;
  children?: React.ReactNode;
  breadcrumbs?: { label: string; href: string }[];
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionLink,
  actionOnClick,
  action,
  children,
  breadcrumbs,
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
      {action}
    </div>
  );
}
