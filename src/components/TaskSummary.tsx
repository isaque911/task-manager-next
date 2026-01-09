"use client";
import { useTasks } from "@/contexts/TaskContext";
import { useEffect, useState } from "react";

export default function TaskSummary() {
  const { tasks } = useTasks();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div>
      <p>
        você tem {total} {total === 1 ? "tarefa" : "tarefas"}, {completed}{" "}
        {completed === 1 ? "tarefa completa" : "tarefas completas"} {pending}{" "}
        {pending === 1 ? "tarefa pendente" : "tarefas pendentes"}
      </p>
    </div>
  );
}
