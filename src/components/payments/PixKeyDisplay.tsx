
import { useState } from "react";
import { PixKey } from "@/types/payment.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface PixKeyDisplayProps {
  pixKey: PixKey;
  onUpdate?: () => void;
}

export function PixKeyDisplay({ pixKey, onUpdate }: PixKeyDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copiado!",
      description: "Chave PIX copiada para a área de transferência"
    });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', pixKey.id);

      if (error) throw error;

      toast({
        title: "Chave removida",
        description: "A chave PIX foi removida com sucesso"
      });
      
      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover chave",
        description: error.message || "Não foi possível remover a chave PIX"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">{pixKey.name || pixKey.owner_name}</p>
              {pixKey.isDefault && <Badge variant="outline">Padrão</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {pixKey.type}: {pixKey.key}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCopy}
              disabled={isDeleting}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover chave PIX</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a chave PIX "{pixKey.key}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
