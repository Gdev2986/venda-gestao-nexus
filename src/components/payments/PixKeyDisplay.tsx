
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PixKey } from "@/types/payment.types";

export interface PixKeyDisplayProps {
  pixKey: PixKey;
  onUpdate?: () => void;
}

export const PixKeyDisplay: React.FC<PixKeyDisplayProps> = ({ pixKey, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const formatPixKey = (key: string, type: string) => {
    // Basic formatting for display purposes
    if (type === "PHONE" && key.length === 11) {
      return `(${key.substring(0, 2)}) ${key.substring(2, 7)}-${key.substring(7)}`;
    }
    if (type === "CPF" && key.length === 11) {
      return `${key.substring(0, 3)}.${key.substring(3, 6)}.${key.substring(6, 9)}-${key.substring(9)}`;
    }
    if (type === "CNPJ" && key.length === 14) {
      return `${key.substring(0, 2)}.${key.substring(2, 5)}.${key.substring(5, 8)}/${key.substring(8, 12)}-${key.substring(12)}`;
    }
    return key;
  };

  const getPixTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      CPF: "CPF",
      CNPJ: "CNPJ",
      EMAIL: "Email",
      PHONE: "Telefone",
      EVP: "Chave aleatória",
      RANDOM: "Chave aleatória",
    };
    return types[type] || type;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("pix_keys")
        .delete()
        .eq("id", pixKey.id);

      if (error) throw error;

      toast({
        title: "Chave PIX removida",
        description: "Sua chave PIX foi removida com sucesso.",
      });

      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error("Error deleting PIX key:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível remover a chave PIX.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{pixKey.name || "Chave PIX"}</p>
          <p className="text-sm text-muted-foreground">
            {getPixTypeLabel(pixKey.type)}: {formatPixKey(pixKey.key, pixKey.type)}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta chave PIX?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default PixKeyDisplay;
