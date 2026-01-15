"use server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createTask(title: string, priority: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Usuário não logado");
  }

  const texto = title.trim();
  if (!texto || texto.length > 40) {
    throw new Error("Título inválido");
  }

  let validPriority = priority;
  if (!["High", "Mid", "Low"].includes(priority)) {
    validPriority = "Low";
  }

  const newTask = await prisma.task.create({
    data: {
      title: texto,
      priority: validPriority as "High" | "Mid" | "Low",
      completed: false,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
  return newTask;
}

export async function deleteAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  await prisma.task.update({
    where: { 
      id,
      userId: session.user.id 
    },
    data: { deletedAt: new Date() },
  });
  
  revalidatePath("/");
}

export async function toggleAction(id: string, currentStatus: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  await prisma.task.update({
    where: { 
      id,
      userId: session.user.id
    },
    data: { completed: !currentStatus },
  });
  
  revalidatePath("/");
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    throw new Error("Preenche todos os campos.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  
  if (existingUser) {
    throw new Error("Este e-mail já esta cadastrado.");
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
