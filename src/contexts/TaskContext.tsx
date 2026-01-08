"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { createTask, deleteAction, toggleAction } from "@/action";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "High" | "Mid" | "Low";
}

interface TasksContextType {
  tasks: Task[];
  addTask: (title: string, priority: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  filterTask: (query: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | null>(null);

export default function TaskProvider({
  children,
  initialTasks = [],
}: {
  children: ReactNode;
  initialTasks?: Task[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  async function filterTask(query: string) {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_KEY ?? "";
      const url = query
        ? `/api/tasks?query=${encodeURIComponent(query)}`
        : "/api/tasks";
      const res = await fetch(url, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Erro ao filtrar tasks", err);
    }
  }

  async function addTask(title: string, priority: string) {
    try {
      const newTask = await createTask(title, priority);

      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      alert("Erro ao criar tarefa (verifique o tamanho do texto)");
    }
  }

  async function removeTask(id: string) {
    try {
      await deleteAction(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      alert("Erro ao deletar");
    }
  }

  async function toggleTask(id: string) {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      await toggleAction(id, task.completed);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    } catch (err) {
      alert("Erro ao atualizar");
    }
  }

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, toggleTask, removeTask, filterTask }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);

  if (!ctx) {
    throw new Error("useTasks deve ser usado dentro de <TasksProvider>");
  }

  return ctx;
}
