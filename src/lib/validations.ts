import { z } from "zod"

/*
    ? Inserção de validações do registro do usuário
*/

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Nome deve conter pelo menos 2 caracteres")
        .max(255, "Nome muito longo"),

    email: z
        .string()
        .email("Email inválido")
        .max(255, "Email muito longo"),

    password: z
        .string()
        .min(8, "A senha deve ter pelo menos 8 caractares"),

})