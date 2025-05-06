
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserRole } from "@/types";
import { AlertTriangle, Shield } from "lucide-react";

const formSchema = z.object({
  notes: z.string().min(1, "É necessário fornecer um motivo para esta alteração."),
});

type FormValues = z.infer<typeof formSchema>;

interface UserRoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
  userName: string;
  userEmail: string;
  currentRole: UserRole;
  newRole: UserRole;
}

export function UserRoleChangeModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
  currentRole,
  newRole,
}: UserRoleChangeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  const isPrivilegeEscalation = 
    (currentRole === UserRole.CLIENT && [UserRole.PARTNER, UserRole.FINANCIAL, UserRole.ADMIN].includes(newRole)) ||
    (currentRole === UserRole.PARTNER && [UserRole.FINANCIAL, UserRole.ADMIN].includes(newRole)) ||
    (currentRole === UserRole.FINANCIAL && newRole === UserRole.ADMIN);

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await onConfirm(data.notes);
      form.reset();
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
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
            Você está alterando a função de <strong>{userName || userEmail}</strong> de <strong>{currentRole}</strong> para <strong>{newRole}</strong>.
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
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant={isPrivilegeEscalation ? "destructive" : "default"}
              >
                {isSubmitting
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

export default UserRoleChangeModal;
