import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations";
import { getAuthUserFromRequest } from "@/lib/get-auth-user";
import { parse } from "path";

type RouteContext = {
    params: Promise<{
        id: string
    }>
}

export async function PUT(request: Request, context: RouteContext) {
    try {
        const authUser = getAuthUserFromRequest(request)
        const { id } = await context.params
        const taskId = Number(id)

        if (Number.isNaN(taskId)) {
            return NextResponse.json(
                { error: "ID da tarefa inválido" },
                { status: 400 }
            )
        }

        const body = await request.json()
        const parsed = updateTaskSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Dados inválidos",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            )
        }

        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: authUser.userId,
            },
        })

        if (!existingTask) {
            return NextResponse.json(
                { error: "Tarefa não encontrada" },
                { status: 404 },
            )
        }

        const { title, description, status } = parsed.data

        const task = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && {
                    description: description || null,
                }),
                ...(status !== undefined && { status }),
            },
        })

        return NextResponse.json({ task }, { status: 200 })

    } catch (error) {
        console.error("UPDATE_TASK_ERROR: ", error)

        return NextResponse.json(
            { error: "Não autorizado" },
            { status: 401 }
        )
    }
}

export async function DELETE(request: Request, context: RouteContext) {
    try {
        const authUser = getAuthUserFromRequest(request)
        const { id } = await context.params
        const taskId = Number(id)

        if (Number.isNaN(taskId)) {
            return NextResponse.json(
                { error: "ID da tarefa inválido" },
                { status: 400 }
            )
        }

        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: authUser.userId,
            },
        })

        if (!existingTask) {
            return NextResponse.json(
                { error: "Tarefa não encontrada" },
                { status: 404 },
            )
        }

        await prisma.task.delete({
            where: {
                id: taskId,
            },
        })

        return NextResponse.json(
            { message: "Tarefa deletada com sucesso" },
            { status: 200 }
        )

    } catch (error) {
        console.error("DELETE_TASK_ERROR", error)

        return NextResponse.json(
            { error: "Não autorizado" },
            { status: 401 }
        )
    }
}