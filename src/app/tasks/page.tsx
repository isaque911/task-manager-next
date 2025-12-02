import Card from "@/components/Card";
import SimpleTodo from "@/components/SimpleTodo";
import TaskSummary from "@/components/TaskSummary";
import TaskProvider from "@/contexts/TaskContext";
import { prisma } from "@/lib/prisma";

export default async function Tasks() {
  const rawTasks = await prisma.task.findMany({
    where: {
      OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
    },
    orderBy: { createdAt: "desc" },
  });

  const initialData = rawTasks.map((task) => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
    deletedAt: task.deletedAt ? task.deletedAt.toISOString() : null,
  }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-50">
      <TaskProvider initialTasks={initialData as any}>
        <Card title="Minhas tarefas">
          <SimpleTodo />
          <TaskSummary />
        </Card>
      </TaskProvider>
    </div>
  );
}
