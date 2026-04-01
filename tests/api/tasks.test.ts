import { prisma } from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/get-auth-user";

import {
    GET as getTasksGET,
    POST as createTaskPOST
} from "@/app/api/tasks/route";

import {
    PUT as updateTaskPUT,
    DELETE as deleteTaskDELETE,
} from "@/app/api/tasks/[id]/route";

jest.mock("@/lib/prisma", () => ({
    prisma: {
        task: {
            findMany: jest.fn(),
            create: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

jest.mock("@/lib/get-auth-user", () => ({
    getAuthUserFromRequest: jest.fn(),
}));

const mockedPrisma = prisma as unknown as {
    task: {
        findMany: jest.Mock;
        create: jest.Mock;
        findFirst: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
};

const request_tasks_url = "http://localhost:3000/api/tasks"
const request_tasks_id_url = "http://localhost:3000/api/tasks/1"

const mockedGetAuthUserFromRequest = getAuthUserFromRequest as jest.Mock;

/*
    ? Criando forma de silenciar o log de erro da validação 
    ? de token para teste de token inexistente,
    ? para que não polua a saída do terminal.
*/

let consoleErrorSpy: jest.SpyInstance

describe("Tasks API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore()
    })

    it("deve bloquear GET /api/tasks sem token", async () => {
        mockedGetAuthUserFromRequest.mockImplementation(() => {
            throw new Error("Token não fornecido");
        });

        const request = new Request(request_tasks_url, {
            method: "GET",
        });

        const response = await getTasksGET(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe("Não autorizado");
    });

    it("deve listar tarefas do usuário autenticado", async () => {
        mockedGetAuthUserFromRequest.mockReturnValue({
            userId: 1,
            email: "yago@email.com",
        });

        mockedPrisma.task.findMany.mockResolvedValue([
            {
                id: 1,
                userId: 1,
                title: "Estudar JWT",
                description: "Revisar autenticação",
                status: "pending",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        const request = new Request(request_tasks_url, {
            method: "GET",
            headers: {
                Authorization: "Bearer token_fake",
            },
        });

        const response = await getTasksGET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(data.tasks)).toBe(true);
        expect(data.tasks).toHaveLength(1);
        expect(data.tasks[0].title).toBe("Estudar JWT");
        expect(mockedPrisma.task.findMany).toHaveBeenCalledWith({
            where: {
                userId: 1,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    });

    it("deve criar tarefa com sucesso", async () => {
        mockedGetAuthUserFromRequest.mockReturnValue({
            userId: 1,
            email: "yago@email.com",
        });

        mockedPrisma.task.create.mockResolvedValue({
            id: 1,
            userId: 1,
            title: "Criar task",
            description: "Descrição teste",
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const request = new Request(request_tasks_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token_fake",
            },
            body: JSON.stringify({
                title: "Criar task",
                description: "Descrição teste",
                status: "pending",
            }),
        });

        const response = await createTaskPOST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.task.title).toBe("Criar task");
        expect(mockedPrisma.task.create).toHaveBeenCalledWith({
            data: {
                title: "Criar task",
                description: "Descrição teste",
                status: "pending",
                userId: 1,
            },
        });
    });

    it("deve atualizar tarefa do próprio usuário", async () => {
        mockedGetAuthUserFromRequest.mockReturnValue({
            userId: 1,
            email: "yago@email.com",
        });

        mockedPrisma.task.findFirst.mockResolvedValue({
            id: 1,
            userId: 1,
            title: "Task antiga",
            description: "Descrição antiga",
            status: "pending",
        });

        mockedPrisma.task.update.mockResolvedValue({
            id: 1,
            userId: 1,
            title: "Task nova",
            description: "Descrição nova",
            status: "completed",
        });

        const request = new Request(request_tasks_id_url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token_fake",
            },
            body: JSON.stringify({
                title: "Task nova",
                description: "Descrição nova",
                status: "completed",
            }),
        });

        const response = await updateTaskPUT(request, {
            params: Promise.resolve({ id: "1" }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.task.title).toBe("Task nova");
        expect(data.task.status).toBe("completed");
        expect(mockedPrisma.task.findFirst).toHaveBeenCalledWith({
            where: {
                id: 1,
                userId: 1,
            },
        });
    });

    it("deve deletar tarefa do próprio usuário", async () => {
        mockedGetAuthUserFromRequest.mockReturnValue({
            userId: 1,
            email: "yago@email.com",
        });

        mockedPrisma.task.findFirst.mockResolvedValue({
            id: 1,
            userId: 1,
            title: "Task para deletar",
            description: "Descrição",
            status: "pending",
        });

        mockedPrisma.task.delete.mockResolvedValue({
            id: 1,
        });

        const request = new Request(request_tasks_id_url, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer token_fake",
            },
        });

        const response = await deleteTaskDELETE(request, {
            params: Promise.resolve({ id: "1" }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toBe("Tarefa deletada com sucesso");
        expect(mockedPrisma.task.delete).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
        });
    });

    it("não deve permitir alterar tarefa de outro usuário", async () => {
        mockedGetAuthUserFromRequest.mockReturnValue({
            userId: 2,
            email: "outro@email.com",
        });

        mockedPrisma.task.findFirst.mockResolvedValue(null);

        const request = new Request(request_tasks_id_url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token_fake",
            },
            body: JSON.stringify({
                title: "Tentativa inválida",
            }),
        });

        const response = await updateTaskPUT(request, {
            params: Promise.resolve({ id: "1" }),
        });

        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe("Tarefa não encontrada");
    });
});