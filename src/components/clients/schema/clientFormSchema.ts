
import * as z from "zod";

// Define the form schema with validations
export const clientFormSchema = z.object({
  business_name: z.string().min(2, { message: "Nome da empresa obrigatório" }),
  document: z.string().min(14, { message: "CNPJ obrigatório" }),
  contact_name: z.string().min(2, { message: "Nome do contato obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(11, { message: "Telefone obrigatório" }),
  address: z.string().min(5, { message: "Endereço obrigatório" }),
  city: z.string().min(2, { message: "Cidade obrigatória" }),
  state: z.string().min(2, { message: "Estado obrigatório" }),
  zip: z.string().min(8, { message: "CEP obrigatório" }),
  balance: z.number().optional().default(0),
  partner_id: z.string().optional(),
  machines: z.array(z.string()).optional(),
});

// Define the form values type
export type ClientFormValues = z.infer<typeof clientFormSchema>;
