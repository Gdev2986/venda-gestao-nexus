
import React, { useState } from "react";
import { usePixKeys } from "@/hooks/usePixKeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircle, Star, StarOff, Trash, Edit, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PixKey } from "@/types";

const PixKeysManager: React.FC = () => {
  const { pixKeys, isLoading: isLoadingPixKeys } = usePixKeys();
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [isEditKeyOpen, setIsEditKeyOpen] = useState(false);
  const [isDeleteKeyOpen, setIsDeleteKeyOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<PixKey | null>(null);
  const { toast } = useToast();

  // Form state
  const [keyName, setKeyName] = useState("");
  const [keyType, setKeyType] = useState("CPF");
  const [keyValue, setKeyValue] = useState("");

  const handleAddKey = () => {
    // Reset form
    setKeyName("");
    setKeyType("CPF");
    setKeyValue("");
    setIsAddKeyOpen(true);
  };

  const handleEditKey = (key: PixKey) => {
    setActiveKey(key);
    setKeyName(key.name);
    setKeyType(key.type);
    setKeyValue(key.key);
    setIsEditKeyOpen(true);
  };

  const handleDeleteKey = (key: PixKey) => {
    setActiveKey(key);
    setIsDeleteKeyOpen(true);
  };

  const handleSaveKey = () => {
    // Validate
    if (!keyName.trim() || !keyValue.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
      });
      return;
    }

    // This is where you would save the key
    toast({
      title: "Chave salva",
      description: "Sua chave PIX foi salva com sucesso",
    });
    setIsAddKeyOpen(false);
  };

  const handleUpdateKey = () => {
    if (!keyName.trim() || !keyValue.trim() || !activeKey) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
      });
      return;
    }

    // This is where you would update the key
    toast({
      title: "Chave atualizada",
      description: "Sua chave PIX foi atualizada com sucesso",
    });
    setIsEditKeyOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!activeKey) return;

    // This is where you would delete the key
    toast({
      title: "Chave removida",
      description: "Sua chave PIX foi removida com sucesso",
    });
    setIsDeleteKeyOpen(false);
  };

  const handleSetDefault = (key: PixKey) => {
    // This is where you would set the key as default
    toast({
      title: "Chave padrão definida",
      description: `A chave ${key.name} foi definida como padrão`,
    });
  };

  // Helper function to format key value for display
  const formatKeyValue = (key: string, type: string): string => {
    if (type === "CPF" && key.length === 11) {
      return `${key.slice(0, 3)}.${key.slice(3, 6)}.${key.slice(6, 9)}-${key.slice(9)}`;
    }
    if (type === "CNPJ" && key.length === 14) {
      return `${key.slice(0, 2)}.${key.slice(2, 5)}.${key.slice(5, 8)}/${key.slice(8, 12)}-${key.slice(12)}`;
    }
    if (type === "PHONE" && key.length >= 10) {
      return `(${key.slice(0, 2)}) ${key.slice(2, 7)}-${key.slice(7)}`;
    }
    return key;
  };

  if (isLoadingPixKeys) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Minhas Chaves PIX</CardTitle>
          <CardDescription>Gerencie suas chaves PIX para receber pagamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Chaves PIX</CardTitle>
        <CardDescription>Gerencie suas chaves PIX para receber pagamentos</CardDescription>
      </CardHeader>
      <CardContent>
        {pixKeys.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Você não possui chaves PIX cadastradas</p>
            <Button onClick={handleAddKey}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Chave PIX
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {pixKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div>
                  <div className="font-medium flex items-center">
                    {key.name}
                    {key.is_default && (
                      <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                        Padrão
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {key.type}: {formatKeyValue(key.key, key.type)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!key.is_default && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSetDefault(key)}
                      title="Definir como padrão"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditKey(key)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteKey(key)}
                    title="Remover"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={handleAddKey} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Chave PIX
            </Button>
          </div>
        )}
      </CardContent>

      {/* Add Key Dialog */}
      <Dialog open={isAddKeyOpen} onOpenChange={setIsAddKeyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Chave PIX</DialogTitle>
            <DialogDescription>
              Adicione uma nova chave PIX para receber pagamentos
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da chave</Label>
              <Input
                id="name"
                placeholder="Exemplo: Chave Pessoal"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de chave</Label>
              <Select
                value={keyType}
                onValueChange={setKeyType}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                  <SelectItem value="EMAIL">E-mail</SelectItem>
                  <SelectItem value="PHONE">Telefone</SelectItem>
                  <SelectItem value="EVP">Chave Aleatória</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Valor da chave</Label>
              <Input
                id="value"
                placeholder={
                  keyType === "CPF" ? "000.000.000-00" :
                  keyType === "CNPJ" ? "00.000.000/0000-00" :
                  keyType === "EMAIL" ? "exemplo@email.com" :
                  keyType === "PHONE" ? "(00) 00000-0000" :
                  "Chave aleatória"
                }
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddKeyOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveKey}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Key Dialog */}
      <Dialog open={isEditKeyOpen} onOpenChange={setIsEditKeyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Chave PIX</DialogTitle>
            <DialogDescription>
              Altere as informações da sua chave PIX
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome da chave</Label>
              <Input
                id="edit-name"
                placeholder="Exemplo: Chave Pessoal"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Tipo de chave</Label>
              <Select
                value={keyType}
                onValueChange={setKeyType}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                  <SelectItem value="EMAIL">E-mail</SelectItem>
                  <SelectItem value="PHONE">Telefone</SelectItem>
                  <SelectItem value="EVP">Chave Aleatória</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-value">Valor da chave</Label>
              <Input
                id="edit-value"
                placeholder={
                  keyType === "CPF" ? "000.000.000-00" :
                  keyType === "CNPJ" ? "00.000.000/0000-00" :
                  keyType === "EMAIL" ? "exemplo@email.com" :
                  keyType === "PHONE" ? "(00) 00000-0000" :
                  "Chave aleatória"
                }
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditKeyOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateKey}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Key Confirmation */}
      <Dialog open={isDeleteKeyOpen} onOpenChange={setIsDeleteKeyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Chave PIX</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover esta chave PIX? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteKeyOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PixKeysManager;
