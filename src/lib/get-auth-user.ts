import { verifyToken } from "@/lib/auth";

export function getAuthUserFromRequest(request: Request) {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Token não fornecido ou mal formatado")
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new Error("Token não fornecido")
    }

    return verifyToken(token)

}