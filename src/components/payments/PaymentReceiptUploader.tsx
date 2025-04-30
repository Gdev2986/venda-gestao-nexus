
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentStatus } from "@/types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type Payment = {
  id: string;
  amount: number;
  description?: string;
  status: PaymentStatus;
  created_at: string;
  due_date?: string;
  receipt_url?: string;
};

interface PaymentReceiptUploaderProps {
  payment: Payment;
  isSubmitting: boolean;
  onSubmit: (paymentId: string, approved: boolean, receiptUrl?: string) => Promise<boolean>;
}

const formSchema = z.object({
  receiptUrl: z.string().url("Por favor, insira uma URL válida").min(1, {
    message: "URL do comprovante é obrigatória",
  }),
});

const PaymentReceiptUploader = ({ payment, isSubmitting, onSubmit }: PaymentReceiptUploaderProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiptUrl: payment.receipt_url || "",
    },
  });
  
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await onSubmit(payment.id, true, data.receiptUrl);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="receiptUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Comprovante</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/comprovante.pdf" {...field} />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground mt-1">
                Insira o link para o comprovante de pagamento (arquivos PDF, imagens etc.)
              </p>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Comprovante"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentReceiptUploader;
