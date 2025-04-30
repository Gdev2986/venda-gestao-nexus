
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PixKey } from "@/types";
import { PlusIcon, StarIcon, TrashIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define props interface matching the expected props in Settings.tsx
export interface PixKeysManagerProps {
  pixKeys: PixKey[];
  isLoading: boolean;
  onAdd: (newKey: Partial<PixKey>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

const PixKeysManager = ({
  pixKeys = [],
  isLoading = false,
  onAdd,
  onDelete,
}: PixKeysManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [keyType, setKeyType] = useState<"CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM">("CPF");
  const [keyValue, setKeyValue] = useState("");
  const [keyName, setKeyName] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    // Basic validation
    if (!keyValue) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar chave",
        description: "Por favor, insira o valor da chave Pix.",
      });
      return;
    }

    if (!keyName) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar chave",
        description: "Por favor, dê um nome para a sua chave.",
      });
      return;
    }

    // Check for profanity (this would be more robust in a real implementation)
    const prohibitedWords = ["palavrao1", "palavrao2", "palavrao3"];
    if (prohibitedWords.some(word => keyName.toLowerCase().includes(word))) {
      toast({
        variant: "destructive",
        title: "Nome não permitido",
        description: "Por favor, escolha outro nome para sua chave Pix.",
      });
      return;
    }

    // Add the key
    if (onAdd) {
      onAdd({
        type: keyType,
        key: keyValue,
        name: keyName,
        is_default: pixKeys.length === 0,
        user_id: "user_id" // This will be replaced by the actual user ID in the parent component
      });
    }

    // Reset form and close dialog
    setKeyType("CPF");
    setKeyValue("");
    setKeyName("");
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chaves Pix</CardTitle>
        <CardDescription>
          Gerencie suas chaves Pix para recebimento de pagamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {pixKeys.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Você não tem chaves Pix cadastradas.
                </p>
              </div>
            ) : (
              pixKeys.map((pixKey) => (
                <div
                  key={pixKey.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="font-medium truncate">{pixKey.name}</p>
                      {pixKey.is_default && (
                        <div className="ml-2 text-xs text-primary flex items-center">
                          <StarIcon className="h-3 w-3 mr-1" />
                          <span>Padrão</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="truncate">
                        {pixKey.type}: {pixKey.key}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center ml-4 space-x-2">
                    {!pixKey.is_default && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast({
                          title: "Definir como padrão",
                          description: "Esta funcionalidade será implementada em breve."
                        })}
                      >
                        <StarIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(pixKey.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center sm:justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Adicionar Chave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Chave</DialogTitle>
              <DialogDescription>
                Cadastre uma nova chave Pix para receber seus pagamentos.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="keyType">Tipo de chave</Label>
                <Select value={keyType} onValueChange={(value: any) => setKeyType(value)}>
                  <SelectTrigger id="keyType" className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPF">CPF</SelectItem>
                    <SelectItem value="CNPJ">CNPJ</SelectItem>
                    <SelectItem value="EMAIL">E-mail</SelectItem>
                    <SelectItem value="PHONE">Telefone</SelectItem>
                    <SelectItem value="RANDOM">Chave aleatória</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keyValue">Chave</Label>
                <Input
                  id="keyValue"
                  placeholder={
                    keyType === "CPF" ? "123.456.789-00"
                    : keyType === "CNPJ" ? "12.345.678/0001-90"
                    : keyType === "EMAIL" ? "seuemail@exemplo.com"
                    : keyType === "PHONE" ? "+55 (11) 98765-4321"
                    : "Chave aleatória"
                  }
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keyName">Nome da chave</Label>
                <Input
                  id="keyName"
                  placeholder="Chave do Bradesco"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSubmit}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PixKeysManager;
