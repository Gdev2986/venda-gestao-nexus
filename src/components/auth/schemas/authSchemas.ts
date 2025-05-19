
import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .email("Entre com um endereço de email válido")
    .min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(72, "A senha é muito longa"),
});

export const registerFormSchema = z.object({
  email: z
    .string()
    .email("Entre com um endereço de email válido")
    .min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(72, "A senha é muito longa"),
  confirmPassword: z
    .string()
    .min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Entre com um endereço de email válido")
    .min(1, "Email é obrigatório"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(72, "A senha é muito longa"),
  confirmPassword: z
    .string()
    .min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});
