import Card from "@/components/Card";
import SimpleTodo from "@/components/SimpleTodo";
import TaskSummary from "@/components/TaskSummary";
import TaskProvider from "@/contexts/TaskContext";
import PaginationControls from "@/components/PaginationControls";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Tasks({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  try {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const query = params.query || "";
    const itemsPerPage = 5;
    const skip = (page - 1) * itemsPerPage;

    const whereClause = {
      userId: session.user.id,
      AND: [
        { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
        { title: { contains: query, mode: "insensitive" as const } }
      ]
    };

    const [rawTasks, totalTasks] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: itemsPerPage,
        skip: skip,
      }),
      prisma.task.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalTasks / itemsPerPage);

    const initialData = rawTasks.map((task) => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
      deletedAt: task.deletedAt ? task.deletedAt.toISOString() : null,
    }));

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-50">
        <TaskProvider initialTasks={initialData as any}>
          <Card title={`Minhas tarefas (Pág ${page})`}>
            <SimpleTodo />
            <TaskSummary />
            <PaginationControls 
              currentPage={page} 
              totalPages={totalPages} 
              hasNextPage={page < totalPages}
              hasPrevPage={page > 1}
            />
          </Card>
        </TaskProvider>
      </div>
    );
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="text-center p-8 border border-slate-800 rounded-lg bg-slate-900">
          <h1 className="text-2xl font-bold text-red-500">Erro no Servidor</h1>
          <p className="text-slate-400 mt-2">Não foi possível carregar suas tarefas. Verifique sua conexão com o banco de dados.</p>
          <a 
            href="/tasks"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Tentar Novamente
          </a>
        </div>
      </div>
    );
  }
}
