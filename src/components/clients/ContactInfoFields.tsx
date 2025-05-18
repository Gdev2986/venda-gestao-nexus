
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormMaskedInput } from "./FormMaskedInput";
import { UseFormReturn } from "react-hook-form";

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
            <FormLabel>Nome do Contato</FormLabel>
            <FormControl>
              <Input placeholder="Nome do contato principal" {...field} />
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
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Email do contato" {...field} />
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
              <FormMaskedInput
                control={form.control}
                name="phone"
                label="Telefone"
                mask="(99) 99999-9999"
                placeholder="(00) 00000-0000"
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
