
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
} from '@/components/ui/alert-dialog';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PixKey } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface PixKeyDisplayProps {
  pixKey: PixKey;
  onUpdate: () => void;
}

export const PixKeyDisplay = ({ pixKey, onUpdate }: PixKeyDisplayProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pixKey.key);
    toast({
      title: 'Chave copiada!',
      description: 'A chave PIX foi copiada para a área de transferência.',
    });
  };

  const handleDeletePixKey = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', pixKey.id);

      if (error) throw error;

      toast({
        title: 'Chave PIX removida',
        description: 'A chave PIX foi removida com sucesso.',
      });
      setShowDialog(false);
      onUpdate();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível remover a chave PIX.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <div className="font-medium">{pixKey.type}</div>
          <div className="text-sm text-muted-foreground">{pixKey.key}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleCopyKey} title="Copiar chave">
            <Copy className="h-4 w-4" />
          </Button>
          
          <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" title="Remover chave">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza de que deseja remover esta chave PIX? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeletePixKey}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Removendo..." : "Remover"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
