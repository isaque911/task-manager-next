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
  
  // Verificação extra de segurança para o ID do usuário
  if (!session?.user?.id) {
    console.log("Sessão inválida ou sem ID de usuário, redirecionando...");
    redirect("/");
  }

  try {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const query = params.query || "";
    const itemsPerPage = 5;
    const skip = (page - 1) * itemsPerPage;

    // Filtro rigoroso para garantir que buscamos apenas tarefas do usuário logado
    // e que o userId não seja nulo no banco
    const whereClause = {
      userId: {
        equals: session.user.id,
        not: null as any
      },
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

    // Mapeamento seguro tratando possíveis campos nulos
    const initialData = rawTasks.map((task) => ({
      ...task,
      id: task.id,
      title: task.title || "Sem título",
      completed: !!task.completed,
      userId: task.userId || session.user.id, // Fallback de segurança
      createdAt: task.createdAt ? task.createdAt.toISOString() : new Date().toISOString(),
      deletedAt: task.deletedAt ? task.deletedAt.toISOString() : null,
    }));

    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-4">
        <TaskProvider initialTasks={initialData as any}>
          <Card title={`Minhas tarefas (${totalTasks})`}>
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
          </Card>
        </TaskProvider>
      </div>
    );
  } catch (error) {
    console.error("Erro crítico ao carregar tarefas:", error);
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="p-8 border border-slate-800 rounded-lg bg-slate-900 shadow-xl">
          <h1 className="text-2xl font-bold text-red-500">Ops! Algo deu errado</h1>
          <p className="text-slate-400 mt-2">
            Houve um problema ao carregar seus dados. Isso pode ser devido a dados antigos no banco.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <a 
              href="/tasks"
              className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
            >
              Tentar Novamente
            </a>
            <a 
              href="/"
              className="px-6 py-2 border border-slate-700 text-slate-300 rounded-full font-medium hover:bg-slate-800 transition"
            >
              Voltar para Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
