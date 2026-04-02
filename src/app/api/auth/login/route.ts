import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
    try {

        const body = await request.json()

        const parsed = loginSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Dados inválidos",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            )
        }

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { error: "Email ou senha inválidos" },
                { status: 401 }
            )
        }

        const passwordIsCorrect = await bcrypt.compare(password, user.password)

        if (!passwordIsCorrect) {
            return NextResponse.json(
                { error: "Email ou senha inválidos" },
                { status: 401 }
            )
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
        })

        const response = NextResponse.json(
            {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 }
        )

        response.cookies.set("token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        })

        return response

    } catch (error) {
        console.error("ERROR_LOGIN: ", error)

        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}