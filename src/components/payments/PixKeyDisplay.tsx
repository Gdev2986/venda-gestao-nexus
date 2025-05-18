
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PixKey } from '@/types/payment.types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';

export interface PixKeyDisplayProps {
  pixKey: PixKey;
  onUpdate?: () => void;
}

export const PixKeyDisplay = ({ pixKey, onUpdate }: PixKeyDisplayProps) => {
  const { toast } = useToast();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(pixKey.key);
    toast({
      title: 'Copiado',
      description: 'Chave PIX copiada para a área de transferência',
    });
  };

  const handleDeleteKey = async () => {
    if (!pixKey.id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', pixKey.id);

      if (error) throw error;

      toast({
        title: 'Chave deletada',
        description: 'A chave PIX foi removida com sucesso',
      });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting PIX key:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível deletar a chave PIX',
      });
    } finally {
      setIsDeleting(false);
      setIsConfirmDialogOpen(false);
    }
  };

  // Format the key type for display
  const formatKeyType = (type: string): string => {
    const typeMap: Record<string, string> = {
      CPF: 'CPF',
      CNPJ: 'CNPJ',
      EMAIL: 'E-mail',
      PHONE: 'Telefone',
      EVP: 'Chave Aleatória',
      RANDOM: 'Chave Aleatória',
    };
    return typeMap[type] || type;
  };

  return (
    <>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">{pixKey.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">{formatKeyType(pixKey.type)}</p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-sm font-mono truncate max-w-[200px]">{pixKey.key}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} title="Copiar">
                <Copy className="h-4 w-4" />
              </Button>
              <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">Remover</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover chave PIX</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover esta chave PIX? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteKey}
                      className="bg-destructive text-destructive-foreground"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Removendo..." : "Remover"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PixKeyDisplay;
