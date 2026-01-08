
import {type  NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tasks
export async function GET(request: NextRequest  ) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query") ?? ""

   
    
  const tasks = await prisma.task.findMany({ 
  where: {
  deletedAt: null,
  title: {
    contains: query,
    mode: "insensitive",
  },
},
    orderBy: { createdAt: "desc" },
  });



  return NextResponse.json(tasks);
}

// POST /api/tasks

export async function POST(req: Request) {
    const body = await req.json()

    const title = String(body.title ?? "").trim()
    const priority = body.priority ?? "Low"
    if (title.length > 40) {
      console.log("Tamanho maximo ultrapassado")
    return NextResponse.json(
        { error: "O título não pode ter mais de 40 caracteres." },
        { status: 400 } 
      );
    }
    if (!title) {
        return NextResponse.json(
            {error: "Precisa de título"},
            {status: 400}
        )
    }

    const task = await prisma.task.create({
        data: {
            title,
            priority: priority,
            completed: false
        },
    })

    return NextResponse.json(task,{status:201})
}

