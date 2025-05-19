
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface MachineFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const MachineFormActions = ({ onCancel, isSubmitting }: MachineFormActionsProps) => {
  return (
    <DialogFooter className="pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </DialogFooter>
  );
};
