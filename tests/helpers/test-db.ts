import { prisma } from "@/lib/prisma";

/*
    ! AVISO: Função feita para testes, deleta o banco de dados entre cada teste.
*/

export async function cleanDatabase() {
    await prisma.user.deleteMany();
    await prisma.task.deleteMany();
}