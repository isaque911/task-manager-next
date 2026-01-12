"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createTask(title: string, priority: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Você precisa estar logado para criar tarefas");
    }

    const texto = title.trim();
    if (!texto || texto.length > 40) {
        throw new Error("Título inválido (max 40 caracteres)")
    }

    let validPriority = priority
    if (!["High", "Mid", "Low"].includes(priority)) {
        validPriority = "Low"
    }

    const newTask = await prisma.task.create({
        data: {
            title: texto,
            priority: validPriority as "High" | "Mid" | "Low",
            completed: false,
            userId: session.user.id // Adicionado para corrigir o erro de build
        }
    })

    revalidatePath("/")

    return newTask
}

export async function deleteAction(id: string) {
    await prisma.task.update({
        where: { id },
        data: { deletedAt: new Date() },
    })

    revalidatePath("/")
}

export async function toggleAction(id: string, currentStatus: boolean) {
    await prisma.task.update({
        where: { id },
        data: { completed: !currentStatus }
    })

    revalidatePath("/")
}
