"use client";
import { useTasks } from "@/contexts/TaskContext";

export default function SearchBar() {
  const { filterTask } = useTasks();
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Buscar tarefas..."
        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-50"
        onChange={(e) => filterTask(e.target.value)}
      />
    </div>
  );
}
