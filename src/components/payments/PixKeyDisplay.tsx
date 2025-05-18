import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { PixKey } from "@/types/payment.types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PixKeyDisplayProps {
  pixKey: PixKey;
  onEdit: (pixKey: PixKey) => void;
  onDelete: (pixKeyId: string) => void;
}

export function PixKeyDisplay({ pixKey, onEdit, onDelete }: PixKeyDisplayProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(pixKey.id);
      toast({
        title: "Chave Pix excluída",
        description: "A Chave Pix foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a Chave Pix.",
      });
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <div className="border rounded-md p-4 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">{pixKey.name}</h3>
        <p className="text-sm text-muted-foreground">
          Chave: {pixKey.key} ({pixKey.type})
        </p>
        <p className="text-sm text-muted-foreground">
          Proprietário: {pixKey.owner_name}
        </p>
        {pixKey.bank_name && (
          <p className="text-sm text-muted-foreground">
            Banco: {pixKey.bank_name}
          </p>
        )}
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(pixKey)}>
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja excluir esta Chave Pix? Esta ação não
                pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteConfirm}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

