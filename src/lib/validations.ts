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

export const loginSchema = z.object({
    email: z
        .string()
        .email("Email inválido")
        .max(255, "Email muito longo"),

    password: z
        .string()
        .min(8, "A Senha deve ter pelo menos 8 caracteres")
})

export const taskSchema = z.object({
    title: z
        .string()
        .min(1, "O título é obrigatório")
        .max(255, "Título muito longo"),

    description: z
        .string()
        .max(1000, "Descrição muito longa")
        .optional()
        .or(z.literal("")),

    status: z.enum(["pending", "in_progress", "completed"]),
})

export const updateTaskSchema = z.object({
    title: z
        .string()
        .min(1, "O título é obrigatório")
        .max(255, "Título muito longo")
        .optional(),

    description: z
        .string()
        .max(1000, "Descrição muito longa")
        .optional()
        .or(z.literal("")),

    status: z.enum(["pending", "in_progress", "completed"]).optional(),
})