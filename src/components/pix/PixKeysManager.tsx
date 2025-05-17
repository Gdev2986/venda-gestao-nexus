import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Edit, Copy, Trash2, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useDialog } from "@/hooks/use-dialog";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { PixKey } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/use-user";
import PixKeyDialog from "@/components/pix/PixKeyDialog";

interface PixKeysManagerProps {
  clientId?: string;
}

const PixKeysManager: React.FC<PixKeysManagerProps> = ({
  clientId
}) => {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<PixKey | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  const { user } = useUser();
  const addPixKeyDialog = useDialog();
  const editPixKeyDialog = useDialog();
  const deletePixKeyDialog = useDialog();

  const fetchPixKeys = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('pix_keys')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setPixKeys(data || []);
      setTotalItems(data?.length || 0);
    } catch (error) {
      console.error("Error fetching pix keys:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as chaves Pix",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchPixKeys();
    }
  }, [clientId]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSetDefault = async (key: PixKey) => {
    if (key.isDefault) return;

    try {
      // Optimistically update the UI
      const updatedKeys = pixKeys.map(pk => ({
        ...pk,
        isDefault: pk.id === key.id
      }));
      setPixKeys(updatedKeys);

      // Call Supabase function to set the default key
      const { error } = await supabase.rpc('set_default_pix_key', {
        pix_key_id: key.id,
        client_uuid: clientId
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Chave padrão atualizada",
        description: "A chave Pix padrão foi atualizada com sucesso",
      });
    } catch (error) {
      console.error("Error setting default pix key:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível definir a chave Pix como padrão",
      });
      // Revert the UI update on error
      fetchPixKeys();
    }
  };

  const handleDelete = async (key: PixKey) => {
    try {
      // Optimistically update the UI
      const updatedKeys = pixKeys.filter(pk => pk.id !== key.id);
      setPixKeys(updatedKeys);

      // Call Supabase function to delete the key
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', key.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Chave Pix excluída",
        description: "A chave Pix foi excluída com sucesso",
      });
    } catch (error) {
      console.error("Error deleting pix key:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a chave Pix",
      });
      // Revert the UI update on error
      fetchPixKeys();
    }
  };

  const handleCreate = async (values: PixKey) => {
    try {
      // Call Supabase function to create the key
      const { data, error } = await supabase
        .from('pix_keys')
        .insert([{
          ...values,
          client_id: clientId,
          user_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Chave Pix criada",
        description: "A chave Pix foi criada com sucesso",
      });
      addPixKeyDialog.close();
      fetchPixKeys();
    } catch (error) {
      console.error("Error creating pix key:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar a chave Pix",
      });
    }
  };

  const handleEdit = async (values: PixKey) => {
    try {
      // Call Supabase function to update the key
      const { error } = await supabase
        .from('pix_keys')
        .update(values)
        .eq('id', selectedKey?.id);

      if (error) throw error;

      toast({
        title: "Chave Pix atualizada",
        description: "A chave Pix foi atualizada com sucesso",
      });
      editPixKeyDialog.close();
      fetchPixKeys();
    } catch (error) {
      console.error("Error updating pix key:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar a chave Pix",
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Chaves Pix</CardTitle>
        <Button size="sm" onClick={addPixKeyDialog.open}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </CardHeader>
      <CardContent className="relative h-full overflow-hidden">
        <ScrollArea className="absolute top-0 left-0 right-0 bottom-16 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Chave</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nome do titular</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(itemsPerPage)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell className="text-right"><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : pixKeys.length > 0 ? (
                pixKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.key}</TableCell>
                    <TableCell>{key.key_type}</TableCell>
                    <TableCell>{key.owner_name}</TableCell>
                    <TableCell className="text-right">
                      {key.isDefault ? (
                        <Badge variant="outline" className="ml-2">Padrão</Badge>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleSetDefault(key)}>
                          Definir como padrão
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setSelectedKey(key);
                            editPixKeyDialog.open();
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedKey(key);
                            deletePixKeyDialog.open();
                          }}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhuma chave Pix encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {pixKeys.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                >
                  <PaginationPrevious className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "pointer-events-none" : ""}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                >
                  <PaginationNext className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <PixKeyDialog
          open={addPixKeyDialog.isOpen}
          onOpenChange={addPixKeyDialog.close}
          onSubmit={handleCreate}
        />

        {selectedKey && (
          <PixKeyDialog
            open={editPixKeyDialog.isOpen}
            onOpenChange={editPixKeyDialog.close}
            onSubmit={handleEdit}
            pixKey={selectedKey}
          />
        )}

        {selectedKey && (
          <PixKeyDialog
            open={deletePixKeyDialog.isOpen}
            onOpenChange={deletePixKeyDialog.close}
            onSubmit={handleDelete}
            pixKey={selectedKey}
            isDeleteMode={true}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PixKeysManager;
