
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { PixKeyForm } from '@/components/payments/PixKeyForm';
import { usePixKeys } from '@/hooks/usePixKeys';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';

interface PixKeyFormData {
  type: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM';
  key: string;
  name: string;
  is_default?: boolean;
}

export const ClientPixKeysManager = () => {
  const { user } = useAuth();
  const { pixKeys, isLoading, refetch } = usePixKeys();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<any>(null);

  const handleCreatePixKey = async (data: PixKeyFormData) => {
    try {
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        });
        return;
      }

      // Get client ID
      const { data: clientId } = await supabase.rpc('get_user_client_id', {
        user_uuid: user.id
      });

      if (!clientId) {
        toast({
          title: "Erro",
          description: "Cliente não encontrado",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('pix_keys')
        .insert({
          user_id: clientId,
          type: data.type,
          key: data.key,
          name: data.name,
          owner_name: data.name,
          is_default: data.is_default || false
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Chave PIX cadastrada com sucesso!"
      });

      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar chave PIX",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePixKey = async (data: PixKeyFormData) => {
    try {
      const { error } = await supabase
        .from('pix_keys')
        .update({
          type: data.type,
          key: data.key,
          name: data.name,
          owner_name: data.name,
          is_default: data.is_default || false
        })
        .eq('id', editingKey.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Chave PIX atualizada com sucesso!"
      });

      setEditingKey(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar chave PIX",
        variant: "destructive"
      });
    }
  };

  const handleDeletePixKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Chave PIX removida com sucesso!"
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover chave PIX",
        variant: "destructive"
      });
    }
  };

  const handleSetAsDefault = async (keyId: string) => {
    try {
      // First, remove default from all keys
      await supabase
        .from('pix_keys')
        .update({ is_default: false })
        .neq('id', keyId);

      // Then set the selected key as default
      const { error } = await supabase
        .from('pix_keys')
        .update({ is_default: true })
        .eq('id', keyId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Chave PIX definida como padrão!"
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao definir chave como padrão",
        variant: "destructive"
      });
    }
  };

  const getKeyTypeDisplay = (type: string) => {
    const types = {
      'CPF': 'CPF',
      'CNPJ': 'CNPJ',
      'EMAIL': 'E-mail',
      'PHONE': 'Telefone',
      'RANDOM': 'Chave Aleatória'
    };
    return types[type as keyof typeof types] || type;
  };

  const formatKey = (key: string, type: string) => {
    switch (type) {
      case 'CPF':
        return key.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      case 'CNPJ':
        return key.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      case 'PHONE':
        return key.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      default:
        return key;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Minhas Chaves PIX</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Minhas Chaves PIX
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Chave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Chave PIX</DialogTitle>
              </DialogHeader>
              <PixKeyForm
                onSubmit={handleCreatePixKey}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pixKeys.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Você ainda não possui chaves PIX cadastradas.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeira Chave
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {pixKeys.map((key) => (
              <div
                key={key.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{key.name}</h3>
                    {key.is_default && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        <Star className="h-3 w-3 fill-current" />
                        Padrão
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getKeyTypeDisplay(key.type)}: {formatKey(key.key, key.type)}
                  </p>
                  {key.owner_name && (
                    <p className="text-xs text-muted-foreground">
                      Titular: {key.owner_name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!key.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetAsDefault(key.id)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingKey(key)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir a chave PIX "{key.name}"?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePixKey(key.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingKey} onOpenChange={() => setEditingKey(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Chave PIX</DialogTitle>
            </DialogHeader>
            {editingKey && (
              <PixKeyForm
                initialData={{
                  type: editingKey.type,
                  key: editingKey.key,
                  name: editingKey.name,
                  is_default: editingKey.is_default
                }}
                onSubmit={handleUpdatePixKey}
                onCancel={() => setEditingKey(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
