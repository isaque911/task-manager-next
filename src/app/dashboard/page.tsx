import { requireUser } from "@/lib/auth-guard";
import Link from "next/link";
import { CheckCircle, User, Settings, BarChart3 } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireUser();

  const cards = [
    {
      title: "Minhas Tarefas",
      description: "Gerencie suas tarefas diárias e pendências.",
      href: "/dashboard/tasks",
      icon: <CheckCircle className="w-8 h-8 text-blue-500" />,
      color: "hover:border-blue-500/50"
    },
    {
      title: "Estatísticas",
      description: "Visualize seu progresso e produtividade.",
      href: "/dashboard/stats",
      icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
      color: "hover:border-purple-500/50"
    },
    {
      title: "Meu Perfil",
      description: "Atualize suas informações pessoais.",
      href: "/dashboard/profile",
      icon: <User className="w-8 h-8 text-green-500" />,
      color: "hover:border-green-500/50"
    },
    {
      title: "Configurações",
      description: "Ajuste as preferências da sua conta.",
      href: "/dashboard/settings",
      icon: <Settings className="w-8 h-8 text-orange-500" />,
      color: "hover:border-orange-500/50"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Olá, {user.name}! 👋</h1>
        <p className="text-slate-400 mt-2">Bem-vindo ao seu painel de controle.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Link 
            key={card.href} 
            href={card.href}
            className={`p-6 bg-slate-900 border border-slate-800 rounded-2xl transition-all hover:scale-[1.02] ${card.color} group`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
