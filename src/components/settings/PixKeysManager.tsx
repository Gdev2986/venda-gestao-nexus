
import React, { useState } from "react";
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
import { usePixKeysManager } from "@/hooks/usePixKeysManager";
import { CreatePixKeyData } from "@/services/pixKeys.service";

const pixKeySchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  key: z.string().min(2, {
    message: "Chave PIX inválida.",
  }),
  type: z.enum(["CPF", "CNPJ", "EMAIL", "PHONE", "RANDOM"]),
  owner_name: z.string().min(2, {
    message: "Nome do titular é obrigatório.",
  }),
  is_default: z.boolean().default(false),
});

export type PixKeyFormValues = z.infer<typeof pixKeySchema>;

interface PixKeysManagerProps {
  userId: string;
}

export function PixKeysManager({ userId }: PixKeysManagerProps) {
  const { pixKeys, isLoading, createPixKey, updatePixKey, deletePixKey, setDefaultPixKey } = usePixKeysManager();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<PixKeyFormValues>({
    resolver: zodResolver(pixKeySchema),
    defaultValues: {
      name: "",
      key: "",
      type: "CPF",
      owner_name: "",
      is_default: false,
    },
  });

  const onSubmit = async (values: PixKeyFormValues) => {
    try {
      if (isEditing) {
        // Ensure all required fields are present for update
        const updateData: CreatePixKeyData = {
          name: values.name,
          key: values.key,
          type: values.type,
          owner_name: values.owner_name,
          is_default: values.is_default,
        };
        
        await updatePixKey(isEditing, updateData);
        setIsEditing(null);
      } else {
        await createPixKey(values);
      }
      
      form.reset();
    } catch (error) {
      // Error is already handled in the hook with toast
      console.error("Error saving PIX key:", error);
    }
  };

  const handleEdit = (key: any) => {
    form.reset({
      name: key.name,
      key: key.key,
      type: key.type as any,
      owner_name: key.owner_name || key.name,
      is_default: key.is_default,
    });
    setIsEditing(key.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePixKey(id);
    } catch (error) {
      // Error is already handled in the hook with toast
      console.error("Error deleting PIX key:", error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPixKey(id);
    } catch (error) {
      // Error is already handled in the hook with toast
      console.error("Error setting default PIX key:", error);
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CPF">CPF</SelectItem>
                          <SelectItem value="CNPJ">CNPJ</SelectItem>
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
                  name="owner_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Titular</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo do titular" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_default"
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
                        {key.is_default ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(key.id)}
                            disabled={isLoading}
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
                            disabled={isLoading}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleDelete(key.id)}
                            disabled={isLoading}
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
