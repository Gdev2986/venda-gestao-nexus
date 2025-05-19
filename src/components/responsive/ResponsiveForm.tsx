
import React from 'react';
import { cn } from '@/lib/utils';
import { useDevice } from '@/hooks/use-device';

interface ResponsiveFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  spacing?: 'compact' | 'normal' | 'relaxed';
  className?: string;
}

export function ResponsiveForm({
  children,
  columns = 1,
  spacing = 'normal',
  className,
  ...props
}: ResponsiveFormProps) {
  const { isMobile, isTablet } = useDevice();
  
  // Calculate columns based on device
  const effectiveColumns = isMobile ? 1 : (isTablet && columns > 2 ? 2 : columns);
  
  // Calculate spacing class
  const spacingClass = {
    compact: 'gap-2',
    normal: 'gap-4',
    relaxed: 'gap-6',
  }[spacing];
  
  return (
    <form
      className={cn(
        'w-full',
        effectiveColumns > 1 && 'sm:grid',
        effectiveColumns === 2 && 'sm:grid-cols-2',
        effectiveColumns === 3 && 'sm:grid-cols-3',
        spacingClass,
        className
      )}
      {...props}
    >
      {children}
    </form>
  );
}

interface ResponsiveFormFieldProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  span?: number;
}

export function ResponsiveFormField({
  children,
  className,
  fullWidth = false,
  span = 1,
}: ResponsiveFormFieldProps) {
  const { isMobile } = useDevice();
  
  return (
    <div
      className={cn(
        'mb-4',
        !isMobile && !fullWidth && span > 1 && `sm:col-span-${span}`,
        !isMobile && fullWidth && 'sm:col-span-full',
        className
      )}
    >
      {children}
    </div>
  );
}

interface ResponsiveFormSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function ResponsiveFormSection({
  children,
  title,
  description,
  className,
}: ResponsiveFormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
