
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PixKey } from "@/types/payment.types";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface PixKeyDisplayProps {
  pixKey: PixKey;
  onUpdate?: () => void;
}

export function PixKeyDisplay({ pixKey, onUpdate }: PixKeyDisplayProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', pixKey.id);
      
      if (error) throw error;
      
      toast({
        title: "Chave PIX removida",
        description: "Sua chave PIX foi removida com sucesso"
      });
      
      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível remover a chave PIX"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  const setAsDefault = async () => {
    setIsSettingDefault(true);
    try {
      // First, set all keys to not default
      await supabase
        .from('pix_keys')
        .update({ is_default: false })
        .neq('id', pixKey.id);
      
      // Then set this key as default
      const { error } = await supabase
        .from('pix_keys')
        .update({ is_default: true })
        .eq('id', pixKey.id);
      
      if (error) throw error;
      
      toast({
        title: "Chave padrão definida",
        description: "Esta chave PIX agora é sua chave padrão"
      });
      
      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível definir a chave padrão"
      });
    } finally {
      setIsSettingDefault(false);
    }
  };
  
  // Show a simplified key for privacy
  const maskKey = (key: string, type: string) => {
    if (type === "CPF" || type === "CNPJ") {
      return "●●●.●●●.●●●-●●";
    } else if (type === "EMAIL") {
      const [username, domain] = key.split('@');
      if (username && domain) {
        return `${username.substring(0, 2)}●●●@${domain}`;
      }
    } else if (type === "PHONE") {
      return "●● ● ●●●●-●●●●";
    }
    return "●●●●●●●●●●●●";
  };
  
  return (
    <>
      <Card className="relative">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{pixKey.name}</p>
              {pixKey.isDefault && (
                <Badge variant="outline" className="text-blue-500 border-blue-500">
                  Padrão
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{pixKey.type}</p>
            <p className="text-sm">{maskKey(pixKey.key, pixKey.type)}</p>
          </div>
          
          <div className="flex space-x-1">
            {!pixKey.isDefault && (
              <Button
                variant="ghost"
                size="icon"
                onClick={setAsDefault}
                disabled={isSettingDefault}
              >
                {isSettingDefault ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span className="sr-only">Definir como padrão</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-500"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
              <span className="sr-only">Remover</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover chave PIX?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta chave PIX? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
