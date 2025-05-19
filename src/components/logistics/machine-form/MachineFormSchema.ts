
import * as z from "zod";

export const machineFormSchema = z.object({
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  clientId: z.string().optional(),
});

export type MachineFormValues = z.infer<typeof machineFormSchema>;
