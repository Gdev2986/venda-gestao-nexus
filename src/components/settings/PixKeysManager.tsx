
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Check, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PixKey } from "@/types";
import { mapPixKeyFromDb, createDefaultPixKeyProperties } from "@/utils/settings-utils";

const pixKeySchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  key: z.string().min(2, {
    message: "Chave PIX inválida.",
  }),
  type: z.enum(["CPF", "EMAIL", "PHONE", "RANDOM"]),
  isDefault: z.boolean().default(false),
});

export type PixKeyFormValues = z.infer<typeof pixKeySchema>;

interface PixKeysManagerProps {
  userId: string;
}

export function PixKeysManager({ userId }: PixKeysManagerProps) {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<PixKeyFormValues>({
    resolver: zodResolver(pixKeySchema),
    defaultValues: {
      name: "",
      key: "",
      type: "CPF",
      isDefault: false,
    },
  });

  // Mock function to fetch PIX keys from database
  const fetchPixKeys = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock data
      const mockData = [
        mapPixKeyFromDb({
          id: '1',
          user_id: userId,
          type: 'CPF',
          key: '123.456.789-00',
          name: 'Meu CPF',
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }),
        mapPixKeyFromDb({
          id: '2',
          user_id: userId,
          type: 'EMAIL',
          key: 'email@example.com',
          name: 'Meu Email',
          is_default: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      ];

      setPixKeys(mockData);
    } catch (error) {
      console.error("Error fetching PIX keys:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as chaves PIX.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPixKeys();
  }, [userId]);

  const onSubmit = async (values: PixKeyFormValues) => {
    try {
      setIsLoading(true);
      
      // If editing existing key
      if (isEditing) {
        const updatedKeys = pixKeys.map(key => {
          if (key.id === isEditing) {
            return { 
              ...key, 
              name: values.name, 
              key: values.key, 
              type: values.type as any, 
              isDefault: values.isDefault 
            };
          }
          // If this key is set to default, remove default from others
          if (values.isDefault && key.id !== isEditing) {
            return { ...key, isDefault: false };
          }
          return key;
        });
        
        setPixKeys(updatedKeys);
        setIsEditing(null);
        toast({
          title: "Chave PIX atualizada",
          description: "A chave PIX foi atualizada com sucesso.",
        });
      } else {
        // Create new PIX key
        const newId = `new-${Date.now()}`;
        const newKey: PixKey = {
          ...createDefaultPixKeyProperties(newId, userId),
          name: values.name,
          key: values.key,
          type: values.type as any,
          isDefault: values.isDefault
        };
        
        // If new key is default, remove default from others
        const updatedKeys = pixKeys.map(key => 
          values.isDefault ? { ...key, isDefault: false } : key
        );
        
        setPixKeys([...updatedKeys, newKey]);
        toast({
          title: "Chave PIX adicionada",
          description: "A chave PIX foi adicionada com sucesso.",
        });
      }
      
      form.reset();
    } catch (error) {
      console.error("Error saving PIX key:", error);
      toast({
        title: "Erro ao salvar chave PIX",
        description: "Não foi possível salvar a chave PIX.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (key: PixKey) => {
    form.reset({
      name: key.name,
      key: key.key,
      type: key.type as any,
      isDefault: key.isDefault,
    });
    setIsEditing(key.id);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      
      const filteredKeys = pixKeys.filter(key => key.id !== id);
      setPixKeys(filteredKeys);
      
      // If editing this key, cancel edit
      if (isEditing === id) {
        setIsEditing(null);
        form.reset();
      }
      
      toast({
        title: "Chave PIX removida",
        description: "A chave PIX foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Error removing PIX key:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a chave PIX.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setIsLoading(true);
      
      const updatedKeys = pixKeys.map(key => ({
        ...key,
        isDefault: key.id === id
      }));
      
      setPixKeys(updatedKeys);
      
      toast({
        title: "Chave padrão alterada",
        description: "A chave PIX padrão foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Error updating default PIX key:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a chave PIX padrão.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chaves PIX</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Chave</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Meu CPF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CPF">CPF</SelectItem>
                          <SelectItem value="EMAIL">Email</SelectItem>
                          <SelectItem value="PHONE">Telefone</SelectItem>
                          <SelectItem value="RANDOM">Aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave PIX</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite sua chave PIX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-2 pt-6">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Chave padrão para recebimentos</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                {isEditing && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isEditing ? "Atualizar Chave" : "Adicionar Chave"}
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Minhas Chaves PIX</h3>
            {isLoading ? (
              <div className="py-4 text-center">Carregando...</div>
            ) : pixKeys.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                Nenhuma chave PIX cadastrada
              </div>
            ) : (
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
                  {pixKeys.map((key) => (
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
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(key)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleDelete(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
