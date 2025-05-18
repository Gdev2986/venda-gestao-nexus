
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

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

interface ContactInfoFieldsProps {
  form: UseFormReturn<any>;
}

const ContactInfoFields = ({ form }: ContactInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="contact_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Contato<span className="text-destructive"> *</span></FormLabel>
            <FormControl>
              <Input placeholder="Nome completo do contato" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email<span className="text-destructive"> *</span></FormLabel>
            <FormControl>
              <Input type="email" placeholder="email@exemplo.com" {...field} />
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
            <FormLabel>Telefone<span className="text-destructive"> *</span></FormLabel>
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
    </>
  );
};

export default ContactInfoFields;
