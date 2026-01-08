import type { Task } from "@/contexts/TaskContext";
import { Trash2, Check } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskList({ tasks, onRemove, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-slate-500">Nenhuma tarefa ainda.</p>;
  }

  const priorityColors: Record<string, string> = {
    High: "border-l-4 border-red-500",
    Mid: "border-l-4 border-yellow-500",
    Low: "border-l-4 border-green-500",
  };

  return (
    <ul className="space-y-2 text-sm">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`rounded bg-slate-900 px-3 py-3 flex items-center justify-between gap-2 border border-slate-800 ${priorityColors[task.priority] ?? "border-l-4 border-gray-500"}`}
        >
          <span className={`truncate flex-1 ${task.completed ? "line-through text-slate-500" : "text-slate-100"}`}>
            {task.title}
          </span>

          <div className="flex gap-2">
            <button
              title="Concluir"
              className="p-2 rounded hover:bg-slate-800 text-green-500 transition-colors"
              onClick={() => onToggle(task.id)}
            >
              <Check size={18} />
            </button>
            <button
              title="Remover"
              className="p-2 rounded hover:bg-slate-800 text-red-500 transition-colors"
              onClick={() => onRemove(task.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
