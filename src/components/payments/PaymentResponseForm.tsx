
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
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  notes: z.string().min(1, {
    message: "É necessário incluir uma nota para a resposta.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentResponseFormProps {
  payment: {
    id: string;
    amount: number;
    status: string;
    created_at: string;
    receipt_url?: string | null;
  };
  onSubmit: (paymentId: string, approved: boolean, receiptUrl?: string) => Promise<boolean>;
}

export function PaymentResponseForm({
  payment,
  onSubmit,
}: PaymentResponseFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"approve" | "reject">("approve");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  const openDialog = (responseType: "approve" | "reject") => {
    setType(responseType);
    setIsOpen(true);
  };

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const receiptUrl = type === "approve" ? "https://example.com/receipt.pdf" : undefined;
      const result = await onSubmit(payment.id, type === "approve", receiptUrl);
      
      if (result) {
        toast({
          title: type === "approve" ? "Pagamento aprovado" : "Pagamento rejeitado",
          description: "Resposta registrada com sucesso.",
        });
        
        form.reset();
        setIsOpen(false);
      }
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
    <>
      <div className="bg-card border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-lg font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(payment.amount)}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(payment.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="space-x-2">
            <Button 
              onClick={() => openDialog("approve")}
              variant="default"
              size="sm"
            >
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Aprovar
            </Button>
            <Button 
              onClick={() => openDialog("reject")}
              variant="outline"
              size="sm"
            >
              <AlertTriangle className="mr-1 h-4 w-4" />
              Rejeitar
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              {type === "approve" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              )}
              <DialogTitle>
                {type === "approve" ? "Aprovar Pagamento" : "Rejeitar Pagamento"}
              </DialogTitle>
            </div>
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
                        ? "Adicione qualquer informação relevante sobre a aprovação. O cliente receberá esta mensagem."
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
                  onClick={() => setIsOpen(false)}
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
    </>
  );
}
