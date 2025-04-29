
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
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  notes: z.string().min(1, {
    message: "É necessário incluir uma nota para a resposta.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentResponseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { notes: string; isApproved: boolean }) => void;
  paymentId: string;
  type: "approve" | "reject";
}

export function PaymentResponseForm({
  isOpen,
  onClose,
  onSubmit,
  paymentId,
  type,
}: PaymentResponseFormProps) {
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
      await onSubmit({ 
        notes: data.notes, 
        isApproved: type === "approve" 
      });
      
      toast({
        title: type === "approve" ? "Pagamento aprovado" : "Pagamento rejeitado",
        description: "Resposta registrada com sucesso.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao processar pagamento",
        description: "Não foi possível registrar a resposta.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "approve" ? "Aprovar Pagamento" : "Rejeitar Pagamento"}
          </DialogTitle>
          <DialogDescription>
            {type === "approve"
              ? "Adicione uma nota de confirmação para este pagamento."
              : "Informe o motivo da rejeição deste pagamento."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        type === "approve"
                          ? "Ex: Pagamento confirmado via sistema."
                          : "Ex: Documentação incompleta. Por favor, envie o comprovante de pagamento."
                      }
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormDescription>
                    {type === "approve"
                      ? "Adicione qualquer informação relevante sobre a aprovação."
                      : "Explique detalhadamente o motivo da rejeição para que o cliente possa resolver o problema."}
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
                variant={type === "approve" ? "default" : "destructive"}
              >
                {isLoading
                  ? "Processando..."
                  : type === "approve"
                  ? "Aprovar Pagamento"
                  : "Rejeitar Pagamento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
