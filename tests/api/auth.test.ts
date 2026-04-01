/*
    ? INFO: 
    ? Fiz os testes com prisma mockado no jest, 
    ? pois o jest apresenta inconsistência com a nova 
    ? versão do prisma-client no prisma 7, 
    ? apresentado na documentação.
*/

jest.mock("@/lib/prisma", () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { POST as loginPOST } from "@/app/api/auth/login/route";
import { POST as registerPOST } from "@/app/api/auth/register/route";

const mockedPrisma = prisma as unknown as {
    user: {
        findUnique: jest.Mock;
        create: jest.Mock;
    };
};

const request_register_url = "http://localhost:3000/api/auth/register"
const request_login_url = "http://localhost:3000/api/auth/login"

describe("Auth API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve registrar um usuário com sucesso", async () => {
        mockedPrisma.user.findUnique.mockResolvedValue(null);

        mockedPrisma.user.create.mockResolvedValue({
            id: 1,
            name: "Yago",
            email: "yago@email.com",
        });

        const request = new Request(request_register_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Yago",
                email: "yago@email.com",
                password: "12345678",
            }),
        });

        const response = await registerPOST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.message).toBe("Usuário registrado com sucesso");
        expect(data.user.email).toBe("yago@email.com");
        expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: "yago@email.com" },
        });
        expect(mockedPrisma.user.create).toHaveBeenCalled();
    });

    it("não deve registrar um email duplicado", async () => {
        mockedPrisma.user.findUnique.mockResolvedValue({
            id: 1,
            name: "Yago",
            email: "yago@email.com",
            password: "hash",
        });

        const request = new Request(request_register_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Yago",
                email: "yago@email.com",
                password: "12345678",
            }),
        });

        const response = await registerPOST(request);
        const data = await response.json();

        expect(response.status).toBe(409);
        expect(data.error).toBe("Email já está em uso");
        expect(mockedPrisma.user.create).not.toHaveBeenCalled();
    });

    it("deve fazer login com sucesso", async () => {
        const hashedPassword = await bcrypt.hash("12345678", 10);

        mockedPrisma.user.findUnique.mockResolvedValue({
            id: 1,
            name: "Yago",
            email: "yago@email.com",
            password: hashedPassword,
        });

        const request = new Request(request_login_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "yago@email.com",
                password: "12345678",
            }),
        });

        const response = await loginPOST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.token).toBeDefined();
        expect(data.user.email).toBe("yago@email.com");
    });

    it("não deve fazer login com senha inválida", async () => {
        const hashedPassword = await bcrypt.hash("12345678", 10);

        mockedPrisma.user.findUnique.mockResolvedValue({
            id: 1,
            name: "Yago",
            email: "yago@email.com",
            password: hashedPassword,
        });

        const request = new Request(request_login_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "yago@email.com",
                password: "senhaerrada",
            }),
        });

        const response = await loginPOST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe("Email ou senha inválidos");
    });
});