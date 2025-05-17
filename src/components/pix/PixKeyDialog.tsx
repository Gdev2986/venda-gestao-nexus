
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PixKey } from "@/types";

const formSchema = z.object({
  key: z.string().min(1, { message: "Chave PIX é obrigatória" }),
  key_type: z.string().min(1, { message: "Tipo de chave é obrigatório" }),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  owner_name: z.string().min(1, { message: "Nome do titular é obrigatório" }),
  isDefault: z.boolean().default(false),
});

interface PixKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => Promise<void>;
  pixKey?: PixKey;
  isDeleteMode?: boolean;
}

export default function PixKeyDialog({ 
  open, 
  onOpenChange, 
  onSubmit,
  pixKey,
  isDeleteMode = false
}: PixKeyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: pixKey?.key || "",
      key_type: pixKey?.key_type || pixKey?.type || "CPF",
      name: pixKey?.name || "",
      owner_name: pixKey?.owner_name || "",
      isDefault: pixKey?.isDefault || false
    }
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (isDeleteMode && pixKey) {
        await onSubmit(pixKey);
      } else {
        await onSubmit(values);
      }
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDeleteMode ? "Excluir Chave PIX" :
              pixKey ? "Editar Chave PIX" : "Adicionar Nova Chave PIX"}
          </DialogTitle>
        </DialogHeader>
        
        {isDeleteMode ? (
          <div className="space-y-4">
            <p>Tem certeza que deseja excluir esta chave PIX?</p>
            <p><strong>Chave:</strong> {pixKey?.key}</p>
            <p><strong>Tipo:</strong> {pixKey?.key_type || pixKey?.type}</p>
            <p><strong>Nome:</strong> {pixKey?.name}</p>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleSubmit(form.getValues())} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="key_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Chave</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
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
                        <SelectItem value="EVP">Aleatória</SelectItem>
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
                      <Input {...field} disabled={isSubmitting} placeholder="Digite a chave PIX" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Chave</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} placeholder="Ex: Chave Pessoal" />
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
                      <Input {...field} disabled={isSubmitting} placeholder="Nome do titular da chave" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        className="mr-2"
                      />
                    </FormControl>
                    <FormLabel className="mt-0">Definir como chave padrão</FormLabel>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} type="button">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : pixKey ? "Atualizar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
