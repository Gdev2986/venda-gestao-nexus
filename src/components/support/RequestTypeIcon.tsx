
import { ClipboardList, Printer, CheckCircle2 } from "lucide-react";

interface RequestTypeIconProps {
  type: string;
  className?: string;
}

export function RequestTypeIcon({ type, className = "h-4 w-4" }: RequestTypeIconProps) {
  switch(type) {
    case "MACHINE":
      return <Printer className={className} />;
    case "SUPPLIES":
      return <ClipboardList className={className} />;
    case "PAYMENT":
      return <CheckCircle2 className={className} />;
    default:
      return <ClipboardList className={className} />;
  }
}
