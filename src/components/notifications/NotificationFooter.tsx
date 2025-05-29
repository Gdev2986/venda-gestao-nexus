
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface NotificationFooterProps {
  onClose: () => void;
}

export const NotificationFooter = ({ onClose }: NotificationFooterProps) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/notifications");
    onClose();
  };

  return (
    <>
      <DropdownMenuSeparator />
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={handleViewAll}
        >
          Ver todas as notificações
        </Button>
      </div>
    </>
  );
};
