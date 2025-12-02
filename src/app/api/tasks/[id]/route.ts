import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

// PATCH /api/tasks/[id] 
export async function PATCH(_req: Request, props:Props) {
  const params = await props.params
  const id = params.id;

  if (!id) {
    
    return NextResponse.json(
      { error: "Parâmetro 'id' é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return NextResponse.json(
        { error: "Tarefa não encontrada!" },
        { status: 404 }
      );
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Erro no PATCH /api/tasks/[id]", err);
    return NextResponse.json(
      { error: "Erro interno ao atualizar tarefa" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] 
export async function DELETE(_req: Request, props: Props) {
  const params = await props.params
  const id = params.id;
  console.log("TENTANDO DELETAR ID:", params.id)
   try {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return NextResponse.json(
        { error: "Tarefa não encontrada!" },
        { status: 404 }
      );
    }

    await prisma.task.update({
      where: { id },
      data: {  deletedAt: new Date() }, 
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("Erro no DELETE /api/tasks/[id]", err);
    return NextResponse.json(
      { error: "Erro interno ao deletar tarefa" },
      { status: 500 }
    );
  }
}
