"use server"

import {prisma} from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createTask(titlte: string, priority: string) {
    const texto = titlte.trim();
    if(!texto || texto.length > 40) {
        throw new Error("Título inválido (max 40 caracteres)")
    }

    let validPriority = priority
    if(!["High", "Mid", "Low"].includes(priority)){
        validPriority = "Low"
    }

    const newTask = await prisma.task.create({
        data: {
            title: texto,
            priority: validPriority as "High" | "Mid" | "Low",
            completed: false
        }
    })

    revalidatePath("/")

    return newTask
}

export async function deleteAction(id:string) {
    await prisma.task.update({
        where: {id},
        data: {deletedAt: new Date()},
    })

    revalidatePath("/")
}

export async function toggleAction(id: string, currentStatus: boolean) {
    await prisma.task.update({
        where: {id},
        data: {completed: !currentStatus}
    })

     revalidatePath("/")
}