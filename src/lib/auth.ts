import jwt from "jsonwebtoken"

/*
    ? Arquivo de autenticação do usuário com Json Web Token
*/

type TokenPayload = {
    userId: number
    email: string
}

function getJwtSecret(): string {

    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error("JWT_SECRET não foi encontrado no arquivo .env")
    }

    return secret
}
export function generateToken(payload: TokenPayload) {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: "1d", // definido tempo de vida do token
    })
}

export function verifyToken(token: string) {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
}