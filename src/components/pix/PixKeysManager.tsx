
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useDialog } from "@/hooks/use-dialog";
import { Badge } from "@/components/ui/badge";
import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/use-user";
import PixKeyDialog from "@/components/pix/PixKeyDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PixKey } from "@/types";

interface PixKeyFormData {
  id?: string;
  key: string;
  type: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM";
  name: string;
  is_default?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface PixKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pixKeyData?: PixKey | null;
  onSave: (keyData: PixKeyFormData) => Promise<void>;
  loading: boolean;
}

const PixKeysManager = () => {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedKey, setSelectedKey] = useState<PixKey | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const deleteDialog = useDialog();
  const { user } = useUser();

  useEffect(() => {
    fetchPixKeys();
  }, [currentPage]);

  const fetchPixKeys = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from("pix_keys")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;

      // Transform data to ensure it matches PixKey interface
      const transformedData: PixKey[] = (data || []).map(item => ({
        id: item.id,
        key: item.key,
        type: item.type,
        name: item.name,
        owner_name: item.name || '', // Add owner_name from name
        user_id: item.user_id,
        is_default: item.is_default || false,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setPixKeys(transformedData);
      setTotalItems(count || 0);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar chaves PIX",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const openDialog = (key?: PixKey) => {
    setSelectedKey(key || null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedKey(null);
  };

  const handleSave = async (keyData: PixKeyFormData) => {
    try {
      setLoading(true);
      if (keyData.id) {
        // Update existing key
        const { error } = await supabase
          .from("pix_keys")
          .update({
            key: keyData.key,
            type: keyData.type,
            name: keyData.name,
            is_default: keyData.is_default
          })
          .eq("id", keyData.id);

        if (error) throw error;

        toast({
          title: "Chave PIX atualizada",
          description: "A chave PIX foi atualizada com sucesso.",
        });
      } else {
        // Create new key
        const { error } = await supabase
          .from("pix_keys")
          .insert({
            key: keyData.key,
            type: keyData.type,
            name: keyData.name,
            is_default: keyData.is_default || false,
            user_id: user?.id
          });

        if (error) throw error;

        toast({
          title: "Chave PIX criada",
          description: "A chave PIX foi criada com sucesso.",
        });
      }
      closeDialog();
      fetchPixKeys();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar chave PIX",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedKey) return;

    try {
      deleteDialog.close();
      setLoading(true);
      const { error } = await supabase
        .from("pix_keys")
        .delete()
        .eq("id", selectedKey.id);

      if (error) throw error;

      toast({
        title: "Chave PIX excluída",
        description: "A chave PIX foi excluída com sucesso.",
      });
      fetchPixKeys();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir chave PIX",
        description: error.message,
      });
    } finally {
      setLoading(false);
      setSelectedKey(null);
    }
  };

  return (
    <>
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Chaves PIX</CardTitle>
          <Button size="sm" onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Chave</TableHead>
                  <TableHead>Nome do Proprietário</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <>
                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : pixKeys.length > 0 ? (
                  pixKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.type}</TableCell>
                      <TableCell>{key.key}</TableCell>
                      <TableCell>{key.owner_name || key.name}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openDialog(key)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedKey(key);
                              deleteDialog.open();
                            }}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Nenhuma chave PIX encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-6 py-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          <PaginationPrevious className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {Math.ceil(totalItems / itemsPerPage)}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
          variant="outline"
          size="sm"
        >
          Próximo
          <PaginationNext className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <PixKeyDialog
        open={isDialogOpen}
        onOpenChange={closeDialog}
        pixKeyData={selectedKey}
        onSave={handleSave}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={deleteDialog.close}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir Chave PIX</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir esta chave PIX? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={deleteDialog.close}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PixKeysManager;
