import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/tasks
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") ?? "";
    const page = Number(searchParams.get("page")) || 1;
    const itemsPerPage = 5;
    const skip = (page - 1) * itemsPerPage;

    const tasks = await prisma.task.findMany({
        where: {
            deletedAt: null,
            title: {
                contains: query,
                mode: "insensitive",
            },
        },
        orderBy: { createdAt: "desc" },
        take: itemsPerPage,
        skip: skip,
    });

    return NextResponse.json(tasks);
}

// POST /api/tasks
export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Não autorizado" },
            { status: 401 }
        );
    }

    const body = await req.json();
    const title = String(body.title ?? "").trim();
    const priority = body.priority ?? "Low";
    
    if (title.length > 40) {
        return NextResponse.json(
            { error: "O título não pode ter mais de 40 caracteres." },
            { status: 400 }
        );
    }
    
    if (!title) {
        return NextResponse.json(
            { error: "Precisa de título" },
            { status: 400 }
        );
    }

    const task = await prisma.task.create({
        data: {
            title,
            priority: priority,
            completed: false,
            userId: session.user.id // Adicionado para corrigir o erro de build
        },
    });

    return NextResponse.json(task, { status: 201 });
}
