"use client";

interface TaskInputProps {
  title: string;
  onTitleChange: (value: string) => void;
  onAdd: () => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  isLoading: boolean;
}

export default function TaskInput({
  title,
  onTitleChange,
  onAdd,
  priority,
  onPriorityChange,
  isLoading,
}: TaskInputProps) {
  return (
    <div className="flex gap-2">
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        disabled={isLoading}
        maxLength={40}
        className="w-full bg-slate-800 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-50 placeholder-slate-400 disabled:opacity-50"
        placeholder="Descreva sua tarefa"
      />
      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        disabled={isLoading}
        className="bg-slate-800 rounded-lg border border-slate-700 text-white disabled:opacity-50"
      >
        <option value="High">Alta</option>
        <option value="Mid">Média</option>
        <option value="Low">Baixa</option>
      </select>
      <button
        onClick={onAdd}
        disabled={isLoading}
        className="px-3 py-2 rounded text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "..." : "Adicionar"}
      </button>
    </div>
  );
}
