
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { formatPhone, isValidEmail } from "@/utils/client-utils";

// Schema for contact information fields
export const contactSchema = z.object({
  contact_name: z.string().min(2, {
    message: "O nome do contato deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  phone: z.string().min(10, {
    message: "O telefone deve ter pelo menos 10 caracteres.",
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFieldsProps {
  form: UseFormReturn<any>;
}

const ContactFields = ({ form }: ContactFieldsProps) => {
  // Watch the phone field to apply formatting
  const phoneValue = form.watch("phone");

  // Apply phone formatting whenever the value changes
  useEffect(() => {
    const currentPhone = phoneValue;
    if (currentPhone && typeof currentPhone === 'string') {
      const formattedPhone = formatPhone(currentPhone);
      if (formattedPhone !== currentPhone) {
        form.setValue("phone", formattedPhone, { shouldValidate: false });
      }
    }
  }, [phoneValue, form]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="contact_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Contato</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo do contato" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(00) 00000-0000" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ContactFields;
