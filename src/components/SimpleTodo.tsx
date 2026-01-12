"use client";
import { useState } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import { useTasks } from "@/contexts/TaskContext";
import SearchBar from "./SearchBar";

export default function SimpleTodo() {
  const { tasks, addTask, removeTask, toggleTask } = useTasks();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [isLoading, setIsLoading] = useState(false); // Loading

  async function handleAdd() {
    const texto = title.trim();
    if (!texto) return;
    setIsLoading(true);
    await addTask(texto, priority);
    setIsLoading(false);
    setTitle("");
    setPriority("Low");
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <SearchBar />
      <TaskInput 
         title={title} 
         onTitleChange={setTitle} 
         priority={priority}
         onPriorityChange={setPriority}
         onAdd={handleAdd}
         isLoading={isLoading} // Passando prop
      />
      <TaskList tasks={tasks} onRemove={removeTask} onToggle={toggleTask} />
    </div>
  );
}
