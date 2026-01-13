import Card from "@/components/Card";
import SimpleTodo from "@/components/SimpleTodo";
import TaskSummary from "@/components/TaskSummary";
import TaskProvider from "@/contexts/TaskContext";
import PaginationControls from "@/components/PaginationControls";
import SearchBar from "@/components/SearchBar"; // <--- Importe
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Tasks({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>; // <--- Query adicionada
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.query || ""; // <--- Pega o texto da busca
  
  const itemsPerPage = 5;
  const skip = (page - 1) * itemsPerPage;

  // FILTROS COMUNS (Pra usar no count e no findMany)
  const whereCondition = {
    userId: session.user.id,
    OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
    // Se tiver query, filtra o título
    ...(query ? {
      title: { contains: query, mode: "insensitive" as const },
    } : {}),
  };

  const rawTasks = await prisma.task.findMany({
    where: whereCondition, // Usa o filtro inteligente
    orderBy: { createdAt: "desc" },
    take: itemsPerPage,
    skip: skip,
  });

  const totalTasks = await prisma.task.count({ where: whereCondition });
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
          <SearchBar /> {/* <--- Barra de Busca aqui */}
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
}
