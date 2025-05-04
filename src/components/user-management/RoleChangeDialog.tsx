
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserRole } from "@/types";
import { AlertTriangle, Shield } from "lucide-react";

const formSchema = z.object({
  notes: z.string().min(1, {
    message: "É necessário incluir uma justificativa para esta alteração.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface RoleChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
  userName: string;
  currentRole: UserRole;
  newRole: UserRole;
}

export function RoleChangeDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  currentRole,
  newRole,
}: RoleChangeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await onConfirm(data.notes);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erro ao alterar função:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar se é uma elevação de privilégios
  const isPrivilegeEscalation = 
    (currentRole === UserRole.CLIENT && (newRole === UserRole.PARTNER || newRole === UserRole.FINANCIAL || newRole === UserRole.ADMIN)) ||
    (currentRole === UserRole.PARTNER && (newRole === UserRole.FINANCIAL || newRole === UserRole.ADMIN)) ||
    (currentRole === UserRole.FINANCIAL && newRole === UserRole.ADMIN);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isPrivilegeEscalation ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <Shield className="h-5 w-5 text-muted-foreground" />
            )}
            <DialogTitle>
              {isPrivilegeEscalation 
                ? "Elevação de Privilégios" 
                : "Alteração de Função"}
            </DialogTitle>
          </div>
          <DialogDescription>
            Você está alterando a função de <strong>{userName}</strong> de <strong>{currentRole}</strong> para <strong>{newRole}</strong>.
            {isPrivilegeEscalation && (
              <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive">
                <p>Esta alteração concederá mais privilégios ao usuário. Certifique-se de que esta ação é necessária e autorizada.</p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justificativa</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Alteração solicitada pelo gerente devido à mudança de responsabilidades."
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Por favor, forneça um motivo para esta alteração de função. Esta informação será registrada para fins de auditoria.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                variant={isPrivilegeEscalation ? "destructive" : "default"}
              >
                {isLoading
                  ? "Processando..."
                  : isPrivilegeEscalation 
                    ? "Confirmar Elevação"
                    : "Confirmar Alteração"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
