"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash } from "lucide-react";

type Task = {
    id: number
    title: string
    description: string
    status: "pending" | "in_progress" | "completed"
    createdAt: string
    updatedAt: string
}

export default function DashboardPage() {
    const router = useRouter()

    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState<"pending" | "in_progress" | "completed">("pending")
    const [creating, setCreating] = useState(false)

    const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

    async function loadTasks() {
        const token = localStorage.getItem("token")

        if (!token) {
            router.push("/login")
            return
        }
        try {
            setLoading(true)
            setError("")

            const response = await fetch("/api/tasks", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                router.push("/login")
                return
            }

            setTasks(data.tasks)

        } catch (error) {
            console.error(error)
            setError("Erro ao carregar tarefas.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTasks()
    }, [])

    async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const token = localStorage.getItem("token")

        const endpoint = editingTaskId ? `/api/tasks/${editingTaskId}` : "api/tasks"
        const method = editingTaskId ? "PUT" : "POST"

        if (!token) {
            router.push("/login")
            return
        }

        try {
            setCreating(true)
            setError("")

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    status,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Erro ao criar tarefa.")
                return
            }

            setTitle("")
            setDescription("")
            setStatus("pending")
            setEditingTaskId(null)

            await loadTasks()

        } catch (error) {
            console.error(error)
            setError("Erro inesperado ao criar tarefa.")
        } finally {
            setCreating(false)
        }
    }

    function handleEditClick(task: Task) {
        setEditingTaskId(task.id)
        setTitle(task.title)
        setDescription(task.description || "")
        setStatus(task.status)
    }

    function handleCancelEdit() {
        setEditingTaskId(null)
        setTitle("")
        setDescription("")
        setStatus("pending")
    }



    async function handleDeleteTask(taskId: number) {
        const token = localStorage.getItem("token")

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setError("")

            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Erro ao deletar tarefa.");
                return;
            }

            await loadTasks();

        } catch (error) {
            console.error(error);
            setError("Erro inesperado ao deletar tarefa.");
        }

    }

    function hadleLogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="mx-auto max-w-3xl">
                <div className="mbb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-black/80">
                        Dashboard
                    </h1>
                    <button
                        type="button"
                        onClick={hadleLogout}
                        className="cursor-pointer m-2 rounded bg-black px-4 py-2 text-white transition hover:bg-red-800"
                    >
                        Sair
                    </button>
                </div>

                <div className="mb-6 rounded bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold text-black">
                        {editingTaskId ? "Editar tarefa" : "Nova Tarefa"}
                    </h2>

                    <form onSubmit={handleCreateTask} className="space-y-4">

                        <div>
                            <label className="mb-1 block text-sm font-medium text-black/60">
                                Título *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-black placeholder:text-gray-500"
                                placeholder="Digite o título da tarefa"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-black/60">
                                Descrição *
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-black placeholder:text-gray-500"
                                placeholder="Digite o título da tarefa"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-black/60">
                                Título *
                            </label>
                            <select
                                className="w-full rounded border px-3 py-2 text-black"
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value as "pending" | "in_progress" | "completed"
                                    )
                                }
                            >
                                <option value="pending">Pendente</option>
                                <option value="in_progress">Em progresso</option>
                                <option value="completed">Finalizado</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={creating}
                            className="cursor-pointer rounded bg-black px-4 py-2 text-white transition hover:bg-black/80 disable:opacity-50"
                        >
                            {creating
                                ? editingTaskId
                                    ? "Salvando..."
                                    : "Criando..."
                                : editingTaskId
                                    ? "Salvar edição"
                                    : "Criar tarefa"
                            }
                        </button>

                        {editingTaskId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="cursor-pointer ml-2 rounded border px-4 py-2 text-black transition hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                        )}
                    </form>
                </div>

                {loading && (
                    <p className="rounded bg-white p-4 shadow">Carregando tarefa...</p>
                )}

                {error && (
                    <p className="rounded bg-white p-4 text-red-600 shadow">{error}</p>
                )}

                {!loading && !error && tasks.length === 0 && (
                    <div className="rounded bg-white p-6 shadow">
                        <p className="text-red-800">Nenhuma tarefa encontrada.</p>
                    </div>
                )}

                {!loading && !error && tasks.length > 0 && (
                    <div className="sppace-y-4">
                        {tasks.map((task) => (
                            <div key={task.id} className="rounded border bg-white p-4 shadow">
                                <div className="flex justify-between items-center gap-2 ">
                                    <div className="mb-2 flex items-start justify-between gap-4">
                                        <h2 className="text-lg font-semibold text-black">
                                            {task.title}
                                        </h2>
                                        <span className="rounded bg-gray-200 px-3 py-1 text-sm text-black/50">
                                            {task.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-col justify-center items-center gap-5">
                                        <button
                                            type="button"
                                            onClick={() => handleEditClick(task)}
                                            className="cursor-pointer rounded bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700"
                                        >
                                            <Pencil className="h-5 w-5 text-white" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="cursor-pointer rounded bg-red-700 px-3 py-1 text-sm text-white transition hover:bg-red-800"
                                        >
                                            <Trash className="h-5 w-5 text-white" />
                                        </button>
                                    </div>

                                </div>

                                <div className="max-w-[50%] flex justify-start items-center">
                                    <p className="text-sm text-gray-600 text-justify">
                                        {task.description || "Sem descrição"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}