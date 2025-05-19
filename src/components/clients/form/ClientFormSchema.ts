
import * as z from "zod";

export const ClientFormSchema = z.object({
  // Company information
  company_name: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().min(14, "CNPJ é obrigatório"),
  partner_id: z.string().optional(),
  initial_balance: z.number().optional().default(0),
  
  // Contact information
  contact_name: z.string().min(1, "Nome do contato é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  
  // Address information
  address: z.string().min(1, "Endereço é obrigatório"),
  address_number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zip_code: z.string().min(8, "CEP é obrigatório"),
});

export type ClientFormValues = z.infer<typeof ClientFormSchema>;
