"use client";

import type { Priority } from "@/contexts/TaskContext";

interface TaskInputProps {
  title: string;
  onTitleChange: (value: string) => void;
  priority: Priority;
  onPriorityChange: (value: Priority) => void;
  onAdd: () => void;
  isLoading: boolean;
}

export default function TaskInput({
  title,
  onTitleChange,
  priority,
  onPriorityChange,
  onAdd,
  isLoading,
}: TaskInputProps) {
  return (
    <div className="space-y-2">
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Nova tarefa"
        className="w-full rounded-md bg-slate-800 border border-slate-700 p-2 text-white"
      />

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as Priority)}
        className="w-full rounded-md bg-slate-800 border border-slate-700 p-2 text-white"
      >
        <option value="High">Alta</option>
        <option value="Mid">Média</option>
        <option value="Low">Baixa</option>
      </select>

      <button
        onClick={onAdd}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-2 rounded-md"
      >
        {isLoading ? "Adicionando..." : "Adicionar"}
      </button>
    </div>
  );
}

