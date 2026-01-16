import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard/tasks");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-center p-4">
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
        Organize sua vida.
      </h1>
      <p className="text-slate-400 text-xl mb-8 max-w-md">
        O gerenciador de tarefas simples, rápido e focado no que importa.
      </p>
      
      <Link 
        href="/api/auth/signin" 
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-500/20"
      >
        Começar Agora Grátis
      </Link>
    </div>
  );
}
