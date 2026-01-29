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

// Tipos Fortes (Alinhados com o Banco)
export type Priority = "High" | "Mid" | "Low";
export type TaskStatus = "TODO" | "DOING" | "DONE";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  status: TaskStatus;
  order: number;
  userId: string;
  description?: string | null;
  createdAt: string; // Vem como string do servidor
}

interface TasksContextType {
  tasks: Task[];
  addTask: (title: string, priority: Priority) => Promise<void>; // Tipagem forte aqui
  removeTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | null>(null);

export default function TaskProvider({
  children,
  initialTasks = [], // Recebe do servidor (page.tsx)
}: {
  children: ReactNode;
  initialTasks?: Task[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Sempre que o servidor mandar dados novos, atualiza a tela.
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  async function addTask(title: string, priority: Priority) {
    try {
      // Server Action cria no banco
      const newTask = await createTask(title, priority);

      // Garantimos que a data fique em formato string no estado
      const taskForState: Task = {
        ...newTask,
        createdAt:
          typeof newTask.createdAt === "string"
            ? newTask.createdAt
            : newTask.createdAt.toISOString(),
      };

      // Atualiza localmente
      setTasks((prev) => [taskForState, ...prev]);
      toast.success("Tarefa criada!");
    } catch {
      toast.error("Erro ao criar tarefa");
    }
  }

  async function removeTask(id: string) {
    try {
      await deleteAction(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Tarefa removida");
    } catch {
      toast.error("Erro ao deletar");
    }
  }

  async function toggleTask(id: string) {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      // Server já descobre o estado atual
      await toggleAction(id);

      // Atualização otimista na UI
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch {
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
    throw new Error("useTasks deve ser usado dentro de <TaskProvider>");
  }
  return ctx;
}
