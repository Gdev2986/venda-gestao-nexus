
import React from 'react';
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  backButton?: boolean;
  backUrl?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  backButton,
  backUrl,
}) => {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          {backButton && (
            <div className="mb-2">
              <Button variant="ghost" size="sm" asChild className="gap-1 pl-0 h-auto">
                <Link to={backUrl || ".."}>
                  <ArrowLeft size={16} />
                  <span>Voltar</span>
                </Link>
              </Button>
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
};
