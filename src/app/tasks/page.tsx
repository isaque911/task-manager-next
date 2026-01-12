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
  
  if (!session?.user?.id) {
  redirect("/api/auth/signin");
}

  try {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const query = params.query || "";
    const itemsPerPage = 5;
    const skip = (page - 1) * itemsPerPage;

    // Consulta simplificada e segura
    const whereClause: any = {
      userId: session?.user?.id || "",
      AND: [
        { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
        { title: { contains: query, mode: "insensitive" } }
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

    // Mapeamento ultra-seguro para evitar erros de tipo ou valores nulos
    const initialData = rawTasks.map((task: any) => ({
      id: task.id,
      title: task.title || "Tarefa sem título",
      completed: Boolean(task.completed),
      userId: task.userId || session?.user?.id || "",
      createdAt: task.createdAt instanceof Date ? task.createdAt.toISOString() : new Date().toISOString(),
      deletedAt: task.deletedAt instanceof Date ? task.deletedAt.toISOString() : null,
    }));

    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8">
        <TaskProvider initialTasks={initialData as any}>
          <Card title={`Minhas tarefas (${totalTasks})`}>
            <div className="space-y-6">
              <SimpleTodo />
              <TaskSummary />
              {totalPages > 1 && (
                <PaginationControls 
                  currentPage={page} 
                  totalPages={totalPages} 
                  hasNextPage={page < totalPages}
                  hasPrevPage={page > 1}
                />
              )}
            </div>
          </Card>
        </TaskProvider>
      </div>
    );
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-6 border border-slate-800 rounded-xl bg-slate-900 shadow-2xl">
          <h1 className="text-xl font-bold text-red-500">Erro de Carregamento</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Não conseguimos carregar suas tarefas. Isso pode ser um problema temporário no banco de dados.
          </p>
          <div className="mt-6">
            <a 
              href="/tasks"
              className="block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Tentar Novamente
            </a>
          </div>
        </div>
      </div>
    );
  }
}
