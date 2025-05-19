
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NotificationFooterProps {
  onClose: () => void;
}

export const NotificationFooter = ({ onClose }: NotificationFooterProps) => {
  return (
    <div className="p-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        asChild
        onClick={onClose}
      >
        <Link to="/notifications">Ver todas notificações</Link>
      </Button>
    </div>
  );
};
