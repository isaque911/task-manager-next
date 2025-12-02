"use client";

interface TaskInputProps {
  title: string;
  onTitleChange: (value: string) => void;
  onAdd: () => void;
  priority: string;
  onPriorityChange: (value: string) => void;
}

export default function TaskInput({
  title,
  onTitleChange,
  onAdd,
  priority,
  onPriorityChange,
}: TaskInputProps) {
  return (
    <div className="flex gap-2">
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        maxLength={40}
        className="w-full bg-slate-800 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-50 placeholder-slate-400"
        placeholder="Descreva sua tarefa"
      />

      <button
        onClick={onAdd}
        className="px-3 py-2 rounded text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
      >
        Adicionar
      </button>
      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className=" bg-slate-800 rounded-lg border border-slate-700 text-white "
      >
        <option value="High">Alta</option>
        <option value="Mid">Média</option>
        <option value="Low">Baixa</option>
      </select>
    </div>
  );
}
