"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { Priority, TaskStatus } from "@prisma/client";

export async function createTask(title: string, priority: Priority) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não logado");
  }

  const texto = title.trim();
  if (!texto || texto.length > 40) {
    throw new Error("Título inválido");
  }

  const lastTask = await prisma.task.findFirst({
    where: {
      userId: session.user.id,
      deletedAt: null,
    },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const nextOrder = (lastTask?.order ?? 0) + 1;

  const validPriority: Priority = Object.values(Priority).includes(priority)
    ? priority
    : Priority.Low;

  const newTask = await prisma.task.create({
    data: {
      title: texto,
      priority: validPriority,
      completed: false,
      userId: session.user.id,
      order: nextOrder,
      status: TaskStatus.TODO,
    },
  });

  revalidatePath("/");
  return newTask;
}

export async function deleteAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  await prisma.task.updateMany({
    where: {
      id,
      userId: session.user.id,
      deletedAt: null,
    },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/");
}

export async function toggleAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  const task = await prisma.task.findFirst({
    where: {
      id,
      userId: session.user.id,
      deletedAt: null,
    },
    select: { completed: true },
  });

  if (!task) throw new Error("Task não encontrada");

  await prisma.task.update({
    where: { id },
    data: { completed: !task.completed },
  });

  revalidatePath("/");
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    throw new Error("Preencha todos os campos.");
  }

  if (password.length < 8) {
    throw new Error("A senha deve ter pelo menos 8 caracteres.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Erro ao criar conta", error);
    throw new Error("Erro ao criar usuário.");
  }
}
