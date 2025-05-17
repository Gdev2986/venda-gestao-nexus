import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentType } from "@/types/enums";
import { PixKey } from "@/types";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface PaymentRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  pixKeys?: PixKey[];
  isSubmitting?: boolean;
}

const formSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório"),
  description: z.string().min(3, "Descrição é obrigatória"),
  payment_type: z.string().min(1, "Tipo de pagamento é obrigatório"),
  pix_key_id: z.string().optional(),
  bank_info: z.object({
    bank_name: z.string().optional(),
    branch_number: z.string().optional(),
    account_number: z.string().optional(),
    account_holder: z.string().optional(),
  }).optional(),
  due_date: z.date().optional(),
});

export function PaymentRequestDialog({
  open,
  onOpenChange,
  onSubmit,
  pixKeys = [],
  isSubmitting = false,
}: PaymentRequestDialogProps) {
  const { toast } = useToast();
  const [paymentType, setPaymentType] = useState<string>(PaymentType.PIX);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
      payment_type: PaymentType.PIX,
      pix_key_id: "",
      bank_info: {
        bank_name: "",
        branch_number: "",
        account_number: "",
        account_holder: "",
      },
      due_date: undefined,
    },
  });
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        amount: "",
        description: "",
        payment_type: PaymentType.PIX,
        pix_key_id: "",
        bank_info: {
          bank_name: "",
          branch_number: "",
          account_number: "",
          account_holder: "",
        },
        due_date: undefined,
      });
      setPaymentType(PaymentType.PIX);
    }
  }, [open, form]);
  
  // Watch for payment type changes
  const watchPaymentType = form.watch("payment_type");
  useEffect(() => {
    setPaymentType(watchPaymentType);
  }, [watchPaymentType]);
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Format amount to number
      const amount = parseFloat(values.amount.replace(/\./g, "").replace(",", "."));
      
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Valor inválido",
          description: "Por favor, insira um valor válido.",
          variant: "destructive",
        });
        return;
      }
      
      // Prepare data based on payment type
      const paymentData = {
        amount,
        description: values.description,
        payment_type: values.payment_type,
        due_date: values.due_date ? format(values.due_date, "yyyy-MM-dd") : undefined,
      };
      
      // Add pix key if payment type is PIX
      if (values.payment_type === PaymentType.PIX && values.pix_key_id) {
        Object.assign(paymentData, { pix_key_id: values.pix_key_id });
      }
      
      // Add bank info if payment type is TED
      if (values.payment_type === PaymentType.TED && values.bank_info) {
        Object.assign(paymentData, { bank_info: values.bank_info });
      }
      
      await onSubmit(paymentData);
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error submitting payment request:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao solicitar o pagamento.",
        variant: "destructive",
      });
    }
  };
  
  // Find default pix key
  const defaultPix = pixKeys?.find((key) => key.isDefault);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicitar Pagamento</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                      <Input
                        placeholder="0,00"
                        className="pl-10"
                        {...field}
                        onChange={(e) => {
                          // Format as currency
                          let value = e.target.value;
                          value = value.replace(/\D/g, "");
                          value = value.replace(/(\d)(\d{2})$/, "$1,$2");
                          value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
                          field.onChange(value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o motivo da solicitação"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Payment Type Field */}
            <FormField
              control={form.control}
              name="payment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pagamento</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={PaymentType.PIX} id="pix" />
                        <Label htmlFor="pix">Pix</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={PaymentType.TED} id="ted" />
                        <Label htmlFor="ted">Transferência Bancária (TED)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={PaymentType.BOLETO} id="boleto" />
                        <Label htmlFor="boleto">Boleto</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Conditional fields based on payment type */}
            {paymentType === PaymentType.PIX && (
              <FormField
                control={form.control}
                name="pix_key_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave Pix</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || (defaultPix ? defaultPix.id : "")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma chave Pix" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pixKeys.length > 0 ? (
                          pixKeys.map((key) => (
                            <SelectItem key={key.id} value={key.id}>
                              {key.key}
                              <span className="ml-1 text-xs text-muted-foreground">{key.isDefault && '(Padrão)'}</span>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            Nenhuma chave Pix cadastrada
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {paymentType === PaymentType.TED && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="bank_info.bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do banco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bank_info.branch_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agência</FormLabel>
                      <FormControl>
                        <Input placeholder="Número da agência" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bank_info.account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conta</FormLabel>
                      <FormControl>
                        <Input placeholder="Número da conta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bank_info.account_holder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titular</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do titular" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {/* Due Date Field - for Boleto */}
            {paymentType === PaymentType.BOLETO && (
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Vencimento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Solicitar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
