"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterComponent() {
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setError("")

        if(password !== confirmPassword) {
            setError("As senhas não coincidem.")
            return
        }

        try {
            
            setLoading(true)

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            })

            const data = await response.json()

            if(!response.ok) {
                setError(data.error || "Erro ao registrar usuário.")
                return
            }

            router.push("/login")

        } catch (error) {
            console.error(error)
            setError("Erro inesperado ao registrar usuário.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
                <h1 className="mb-6 text-2xl font-bold text-black/80">Criar conta</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-black/60">Nome *</label>
                        <input
                         type="text"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         className="w-full rounded border px-3 py-2 text-black placeholder:text-gray-400"
                         placeholder="Digite seu nome" 
                         required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-black/60">Email *</label>
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

                    <div>
                        <label className="mb-1 block text-sm font-medium text-black/60">Confirme sua senha *</label>
                        <input
                         type="password"
                         value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                         className="w-full rounded border px-3 py-2 text-black placeholder:text-gray-400"
                         placeholder="***********" 
                         required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer hover:bg-transparent hover:text-black border border-border transition w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Criando conta..." : "Registrar"}
                    </button>

                </form>
            </div>
        </main>
    );
}