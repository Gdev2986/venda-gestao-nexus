
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PixKey } from "@/types";
import { Check, Trash2 } from "lucide-react";

interface PixKeysManagerProps {
  userId: string;
}

const PixKeysManager: React.FC<PixKeysManagerProps> = ({ userId }) => {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Simulate fetching PIX keys
  useEffect(() => {
    setIsLoading(true);
    
    // Mock data - in a real app, this would fetch from an API
    setTimeout(() => {
      const mockPixKeys: PixKey[] = [
        {
          id: '1',
          user_id: userId,
          key_type: 'CPF',
          type: 'CPF',
          key: '123.456.789-00',
          owner_name: 'Usuário Teste',
          name: 'Meu CPF',
          isDefault: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bank_name: 'Banco Digital'
        }
      ];
      
      setPixKeys(mockPixKeys);
      setIsLoading(false);
    }, 500);
  }, [userId]);
  
  const handleAddKey = () => {
    toast({
      title: "Adicionar chave",
      description: "Funcionalidade disponível em breve.",
    });
  };
  
  const handleDeleteKey = (id: string) => {
    // In a real app, this would call an API
    setPixKeys(pixKeys.filter(key => key.id !== id));
    
    toast({
      title: "Chave removida",
      description: "A chave PIX foi removida com sucesso.",
    });
  };
  
  const handleSetDefault = (id: string) => {
    // Update default status
    setPixKeys(pixKeys.map(key => ({
      ...key,
      isDefault: key.id === id
    })));
    
    toast({
      title: "Chave padrão definida",
      description: "A chave PIX padrão foi atualizada com sucesso.",
    });
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <p className="text-center py-4">Carregando chaves PIX...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Chave</TableHead>
                <TableHead className="w-[100px]">Padrão</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pixKeys.length > 0 ? (
                pixKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell>{key.type}</TableCell>
                    <TableCell>{key.key}</TableCell>
                    <TableCell>
                      {key.isDefault ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(key.id)}
                        >
                          Definir
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    Nenhuma chave PIX cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end">
            <Button onClick={handleAddKey}>Adicionar Chave PIX</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PixKeysManager;
