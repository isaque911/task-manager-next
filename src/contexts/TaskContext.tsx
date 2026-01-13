"use client";
import {
  createContext,
  useContext,
  useEffect, 
  useState,
  type ReactNode,
} from "react";
import { createTask, deleteAction, toggleAction } from "@/app/actions";
import toast from "react-hot-toast";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "High" | "Mid" | "Low";
  userId?: string; 
}

interface TasksContextType {
  tasks: Task[];
  addTask: (title: string, priority: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | null>(null);

export default function TaskProvider({ 
  children, 
  initialTasks = [] // Recebe do servidor (page.tsx)
}: { 
  children: ReactNode;
  initialTasks?: Task[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Sempre que o servidor mandar dados novos (mudou página ou busca), atualiza a tela.
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  async function addTask(title: string, priority: string) {
    try {
      // Chama Server Action
      const newTask = await createTask(title, priority);
      
      // Atualiza localmente 
      setTasks((prev) => [newTask, ...prev]);
      toast.success("Tarefa criada!");
    } catch (err) {
      toast.error("Erro ao criar tarefa");
    }
  }

  async function removeTask(id: string) {
    try {
      await deleteAction(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Tarefa removida");
    } catch (err) {
      toast.error("Erro ao deletar");
    }
  }

  async function toggleTask(id: string) {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      await toggleAction(id, task.completed);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      toast.error("Erro ao atualizar");
    }
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask, removeTask }}>
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
