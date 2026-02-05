"use client";

import { useState } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import { useTasks } from "@/contexts/TaskContext";
import { Priority } from "@prisma/client"; 

export default function SimpleTodo() {
  const { tasks, addTask, removeTask, toggleTask } = useTasks();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.Low);
  // agora NÃO é string, é Priority de verdade

  const [isLoading, setIsLoading] = useState(false);

  async function handleAdd() {
    const texto = title.trim();
    if (!texto) return;

    setIsLoading(true);
    await addTask(texto, priority);
    setIsLoading(false);

    setTitle("");
    setPriority(Priority.Low); // mantém consistência
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <TaskInput
        title={title}
        onTitleChange={setTitle}
        priority={priority}
        onPriorityChange={setPriority}
        onAdd={handleAdd}
        isLoading={isLoading}
      />

      <TaskList
        tasks={tasks}
        onRemove={removeTask}
        onToggle={toggleTask}
      />
    </div>
  );
}
