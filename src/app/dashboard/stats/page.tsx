import { requireUser } from "@/lib/auth-guard";  
import { prisma } from "@/lib/prisma";  
import PriorityChart from "@/components/PriorityChart";  
import { CheckCircle, Clock, ListTodo } from "lucide-react";  
  
export const dynamic = "force-dynamic";  
  
export default async function StatsPage() {  
  const user = await requireUser();  
  
  // 1. Buscas Paralelas (Muito rápido)  
  const [total, completed, high, mid, low] = await Promise.all([  
    prisma.task.count({ where: { userId: user.id, deletedAt: null } }),  
    prisma.task.count({ where: { userId: user.id, deletedAt: null, completed: true } }),  
    prisma.task.count({ where: { userId: user.id, deletedAt: null, priority: "High" } }),  
    prisma.task.count({ where: { userId: user.id, deletedAt: null, priority: "Mid" } }),  
    prisma.task.count({ where: { userId: user.id, deletedAt: null, priority: "Low" } }),  
  ]);  
  
  const pending = total - completed;  
    
  const chartData = [  
    { name: "High", value: high },  
    { name: "Mid", value: mid },  
    { name: "Low", value: low },  
  ];  
  
  return (  
    <div className="space-y-8">  
      <h1 className="text-3xl font-bold text-white">Estatísticas</h1>  
  
      {/* KPIs */}  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">  
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">  
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">  
            <ListTodo size={24} />  
          </div>  
          <div>  
            <p className="text-slate-400 text-sm">Total de Tarefas</p>  
            <p className="text-2xl font-bold">{total}</p>  
          </div>  
        </div>  
  
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">  
          <div className="p-3 bg-green-500/10 rounded-lg text-green-500">  
            <CheckCircle size={24} />  
          </div>  
          <div>  
            <p className="text-slate-400 text-sm">Concluídas</p>  
            <p className="text-2xl font-bold">{completed}</p>  
          </div>  
        </div>  
  
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">  
          <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">  
            <Clock size={24} />  
          </div>  
          <div>  
            <p className="text-slate-400 text-sm">Pendentes</p>  
            <p className="text-2xl font-bold">{pending}</p>  
          </div>  
        </div>  
      </div>  
  
      {/* Gráfico */}  
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">  
        <h2 className="text-xl font-bold mb-6">Distribuição por Prioridade</h2>  
        <PriorityChart data={chartData} />  
      </div>  
    </div>  
  );  
}
