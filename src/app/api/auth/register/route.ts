import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"

export async function POST(request: Request) {
    try {

        const body = await request.json()

        const parsed = registerSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Dados inválidos",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            )
        }

        const { name, email, password } = parsed.data

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Email já está em uso" },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        })

        return NextResponse.json(
            {
                message: "Usuário registrado com sucesso",
                user,
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("ERROR_REGISTER:", error)

        return NextResponse.json(
            { error: "Erro interno do sevidor" },
            { status: 500 }
        )
    }
}