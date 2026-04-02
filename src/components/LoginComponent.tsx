"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginComponent() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")

        try {
            setLoading(true)

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            const data = await response.json()
            
            if(!response.ok) {
                setError(data.error || "Erro ao fazer login.")
                return
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user))

            router.push("/dashboard")

        } catch (error) {
            console.error(error)
            setError("Erro inesperado ao fazer login")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
                <h1 className="mb-6 text-2xl font-bold text-black/80">Entrar</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-black/60">
                            Email *
                        </label>
                        <input
                         type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full rounded border px-3 py-2 text-black placeholder:text-gray-400"
                         placeholder="seu@email.com" 
                         required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-black/60">Senha *</label>
                        <input
                         type="password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full rounded border px-3 py-2 text-black placeholder:text-gray-400"
                         placeholder="**********" 
                         required
                        />
                    </div>

                    <div className="text-black flex flex-row gap-2 justify-end">
                        <p>Não tem conta?</p>
                        <Link className="text-blue-600 hover:underline" href="./register">cadastrar-se</Link>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer hover:bg-transparent hover:text-black border border-border transition w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                </form>
            </div>
        </main>
    );
}