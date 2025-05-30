
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PixKey } from "@/types/payment.types";
import { Copy, Info, Check, Trash2, Star, StarOff } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PixKeyDisplayProps {
  pixKey: PixKey;
  onUpdate?: () => void;
}

export function PixKeyDisplay({ pixKey, onUpdate }: PixKeyDisplayProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pixKey.key);
    setCopied(true);
    toast({
      title: "Chave copiada!",
      description: "A chave PIX foi copiada para a área de transferência",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("pix_keys")
        .delete()
        .eq("id", pixKey.id);

      if (error) throw error;

      toast({
        title: "Chave excluída",
        description: "A chave PIX foi removida com sucesso",
      });

      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir a chave PIX",
      });
    } finally {
      setIsUpdating(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSetDefault = async () => {
    setIsUpdating(true);
    try {
      // First, unset all defaults
      const { error: updateError1 } = await supabase
        .from("pix_keys")
        .update({ is_default: false })
        .neq("id", pixKey.id);

      if (updateError1) throw updateError1;

      // Then set this one as default
      const { error: updateError2 } = await supabase
        .from("pix_keys")
        .update({ is_default: true })
        .eq("id", pixKey.id);

      if (updateError2) throw updateError2;

      toast({
        title: "Chave padrão",
        description: "A chave PIX foi definida como padrão",
      });

      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível definir a chave como padrão",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getPixTypeLabel = (type: string) => {
    switch (type.toUpperCase()) {
      case "CPF":
        return "CPF";
      case "CNPJ":
        return "CNPJ";
      case "EMAIL":
        return "E-mail";
      case "PHONE":
        return "Telefone";
      case "EVP":
      case "RANDOM":
        return "Chave aleatória";
      default:
        return type;
    }
  };

  return (
    <>
      <div className="border rounded-md p-3 flex flex-col dark:border-[#262626] dark:bg-[#1f1f1f]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-medium dark:text-white">{pixKey.name || "Chave PIX"}</h4>
              {pixKey.is_default && (
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full dark:bg-blue-900/20 dark:text-blue-300">
                  Padrão
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded dark:bg-[#262626] dark:text-gray-300">
                {getPixTypeLabel(pixKey.type)}
              </span>
              <Info className="h-3 w-3 text-muted-foreground dark:text-gray-400" />
            </div>
          </div>
          
          <div className="flex gap-1">
            {!pixKey.is_default && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 dark:text-gray-300 dark:hover:bg-[#262626]"
                title="Definir como padrão"
                onClick={handleSetDefault}
                disabled={isUpdating}
              >
                <Star className="h-4 w-4" />
              </Button>
            )}
            {pixKey.is_default && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary dark:text-blue-400"
                title="Padrão"
                disabled
              >
                <StarOff className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 dark:text-gray-300 dark:hover:bg-[#262626]"
              title="Excluir chave"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isUpdating}
            >
              <Trash2 className="h-4 w-4 text-destructive dark:text-red-400" />
            </Button>
          </div>
        </div>

        <div className="flex mt-2 items-center gap-1">
          <div className="text-sm font-mono text-muted-foreground flex-1 truncate dark:text-gray-400">
            {pixKey.key}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 dark:text-gray-300 dark:hover:bg-[#262626]"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="h-3 w-3 mr-1" />
            )}
            <span className="text-xs">Copiar</span>
          </Button>
        </div>
        
        <div className="mt-1 text-xs text-muted-foreground dark:text-gray-400">
          {pixKey.owner_name && (
            <span>Titular: {pixKey.owner_name}</span>
          )}
          {pixKey.bank_name && (
            <>
              {pixKey.owner_name && <span> · </span>}
              <span>Banco: {pixKey.bank_name}</span>
            </>
          )}
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="dark:bg-[#1f1f1f] dark:border-[#262626]">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Excluir chave PIX</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              Tem certeza que deseja excluir esta chave PIX? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating} className="dark:bg-[#262626] dark:text-white dark:border-[#262626]">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
