import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethod } from "@/types";

// Schema para validação do formulário
const feeFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  paymentMethod: z.enum(["CREDIT", "DEBIT", "PIX"]),
  installments: z.string().refine((val) => {
    if (val === "ALL") return true;
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 1 && num <= 21;
  }, {
    message: "O número de parcelas deve estar entre 1 e 21.",
  }),
  feePercentage: z.string().refine((val) => {
    const num = parseFloat(val.replace(",", "."));
    return !isNaN(num) && num >= 0 && num <= 100;
  }, {
    message: "O percentual da taxa deve estar entre 0 e 100.",
  }),
  clientId: z.string().optional(),
});

type FeeFormValues = z.infer<typeof feeFormSchema>;

interface Client {
  id: string;
  name: string;
}

interface Fee {
  id: string;
  name: string;
  paymentMethod: string;
  installments: string;
  feePercentage: string;
  clientId?: string;
}

interface FeeManagerProps {
  clients: Client[];
  existingFees: Fee[];
  onSave: (fee: FeeFormValues) => Promise<void>;
}

export function FeeManager({ clients, existingFees, onSave }: FeeManagerProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableInstallments, setAvailableInstallments] = useState<string[]>([]);

  const form = useForm<FeeFormValues>({
    resolver: zodResolver(feeFormSchema),
    defaultValues: {
      name: "",
      paymentMethod: "CREDIT",
      installments: "1",
      feePercentage: "2.00",
      clientId: undefined,
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");
  const watchClientId = form.watch("clientId");

  // Atualiza as parcelas disponíveis conforme o método de pagamento
  useEffect(() => {
    if (watchPaymentMethod === "CREDIT") {
      // Para crédito, permitir 1 a 21 parcelas
      const all = Array.from({ length: 21 }, (_, i) => (i + 1).toString());
      
      // Remove parcelas que já existem para o mesmo cliente (ou para todos clientes se clientId não especificado)
      const takenInstallments = existingFees
        .filter(fee => fee.paymentMethod === "CREDIT" && (!watchClientId || fee.clientId === watchClientId))
        .map(fee => fee.installments);
        
      const available = all.filter(installment => !takenInstallments.includes(installment));
      setAvailableInstallments(available);
      
      // Se a parcela atual não estiver disponível, seleciona a primeira disponível
      if (available.length > 0 && !available.includes(form.getValues("installments"))) {
        form.setValue("installments", available[0]);
      }
    } else {
      // Para débito e PIX, só permitir 1 parcela
      setAvailableInstallments(["1"]);
      form.setValue("installments", "1");
    }
  }, [watchPaymentMethod, watchClientId, existingFees, form]);

  async function onSubmit(values: FeeFormValues) {
    setIsSubmitting(true);
    
    try {
      // Verifica duplicação de taxa
      const isDuplicate = existingFees.some(
        fee => 
          fee.paymentMethod === values.paymentMethod && 
          fee.installments === values.installments &&
          (!values.clientId || fee.clientId === values.clientId)
      );
      
      if (isDuplicate) {
        toast({
          title: "Taxa duplicada",
          description: `Já existe uma taxa para ${values.paymentMethod === "CREDIT" ? "Crédito" : values.paymentMethod === "DEBIT" ? "Débito" : "PIX"} em ${values.installments}x ${values.clientId ? "para este cliente" : ""}.`,
          variant: "destructive",
        });
        return;
      }
      
      await onSave(values);
      
      // Resetar o formulário após envio bem-sucedido
      form.reset();
      
      toast({
        title: "Taxa salva com sucesso",
        description: `A taxa foi configurada para ${values.paymentMethod === "CREDIT" ? "Crédito" : values.paymentMethod === "DEBIT" ? "Débito" : "PIX"} em ${values.installments}x.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar taxa",
        description: "Ocorreu um erro ao salvar a taxa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar Taxa</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Taxa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Taxa Padrão Crédito" {...field} />
                  </FormControl>
                  <FormDescription>
                    Um nome descritivo para identificar esta taxa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CREDIT">Crédito</SelectItem>
                        <SelectItem value="DEBIT">Débito</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="installments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcelas</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                      disabled={watchPaymentMethod !== "CREDIT" || availableInstallments.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o número de parcelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableInstallments.length > 0 ? (
                          availableInstallments.map(installment => (
                            <SelectItem key={installment} value={installment}>
                              {installment}x
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="1" disabled>
                            Não há parcelas disponíveis
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {watchPaymentMethod !== "CREDIT" ? 
                        "Débito e PIX são sempre processados em 1x." : 
                        "Selecione o número de parcelas para esta taxa."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="feePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentual da Taxa (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="2.50" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use ponto ou vírgula para valores decimais.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente (opcional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Aplicar a todos os clientes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Aplicar a todos os clientes</SelectItem>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Se não selecionar um cliente, a taxa será aplicada a todos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Taxa"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
