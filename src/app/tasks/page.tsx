import Card from "@/components/Card";
import SimpleTodo from "@/components/SimpleTodo";
import TaskSummary from "@/components/TaskSummary";
import TaskProvider from "@/contexts/TaskContext";
import PaginationControls from "@/components/PaginationControls";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Tasks({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const itemsPerPage = 5;
  const skip = (page - 1) * itemsPerPage;

  // Busca Paginada + Soft Delete
  const rawTasks = await prisma.task.findMany({
    where: { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
    orderBy: { createdAt: "desc" },
    take: itemsPerPage,
    skip: skip,
  });

  const totalTasks = await prisma.task.count({
    where: { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
  });
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
}
