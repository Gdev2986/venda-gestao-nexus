
import { CheckCircle2, ClipboardList, Printer } from "lucide-react";

interface RequestTypeIconProps {
  type: string;
}

const RequestTypeIcon = ({ type }: RequestTypeIconProps) => {
  switch(type) {
    case "MACHINE":
      return <Printer className="h-4 w-4" />;
    case "SUPPLIES":
      return <ClipboardList className="h-4 w-4" />;
    case "PAYMENT":
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <ClipboardList className="h-4 w-4" />;
  }
};

export default RequestTypeIcon;
