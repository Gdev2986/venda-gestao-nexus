
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ClientFormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
}

export const ClientFormActions = ({ onCancel, isLoading }: ClientFormActionsProps) => {
  return (
    <DialogFooter className="flex flex-col sm:flex-row gap-2">
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar"
        )}
      </Button>
    </DialogFooter>
  );
};
