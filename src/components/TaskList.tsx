import type { Task } from "../contexts/TaskContext";

interface TaskListProps {
  tasks: Task[];
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskList({ tasks, onRemove, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Nenhuma tarefa ainda. Adicione a primeira.
      </p>
    );
  }

  return (
    <ul className="space-y-1 text-sm">
      {tasks.map((task) => {
        console.log("Tarefa:", task.title, "Prioridade:", task.priority);
        const titleClass = task.completed
          ? "line-through text-slate-500"
          : "text-slate-100";

        const priorityColors = {
          High: "border-l-4 border-red-500",
          Mid: "border-l-4 border-yellow-500",
          Low: "border-l-4 border-green-500",
        };

        return (
          <li
            key={task.id}
            className={`rounded  bg-slate-900 px-3 py-2 flex items-center justify-between gap-2 ${
              priorityColors[task.priority]
            }`}
          >
            <span
              className={
                titleClass + `truncate ${task.completed ? "..." : "..."}`
              }
              onClick={() => onToggle(task.id)}
            >
              {task.title} - {task.priority}
            </span>

            <button
              className="px-3 py-1 rounded text-xs font-medium transition-colors bg-red-600 text-white hover:bg-red-700"
              onClick={() => onRemove(task.id)}
            >
              Remover
            </button>
          </li>
        );
      })}
    </ul>
  );
}
