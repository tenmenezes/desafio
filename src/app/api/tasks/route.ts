import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validations";
import { getAuthUserFromRequest } from "@/lib/get-auth-user";

export async function GET(request: Request) {
    try {

        const authUser = getAuthUserFromRequest(request);

        const tasks = await prisma.task.findMany({
            where: {
                userId: authUser.userId,
            },
            orderBy: {
                createdAt: "desc"
            },
        })

        return NextResponse.json({ tasks }, { status: 200 })

    } catch (error) {

        console.error("GET_TASKS_ERROR: ", error)

        return NextResponse.json(
            { error: "Não autorizado" },
            { status: 401 }
        )
    }
}

export async function POST(request: Request) {
    try {

        const authUser = getAuthUserFromRequest(request)

        const body = await request.json()

        const parsed = taskSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Dados inválidos",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 },
            )
        }

        const { title, description, status } = parsed.data

        const task = await prisma.task.create({
            data: {
                title,
                description: description || null,
                status,
                userId: authUser.userId,
            },
        })

        return NextResponse.json({ task }, { status: 201 })

    } catch (error) {

        console.error("CREATE_TASKS_ERROR: ", error)

        return NextResponse.json(
            { error: "Não autorizado" },
            { status: 401 },
        )
    }
}