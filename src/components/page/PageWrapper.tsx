
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const PageWrapper = ({
  children,
  className,
  noPadding = false,
}: PageWrapperProps) => {
  return (
    <div
      className={cn(
        "w-full",
        !noPadding && "p-4 sm:p-6 pt-0 sm:pt-0",
        className
      )}
    >
      {children}
    </div>
  );
};
