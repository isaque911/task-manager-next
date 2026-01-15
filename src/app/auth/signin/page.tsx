"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { registerUser } from "@/app/actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading(isLogin ? "Entrando..." : "Criando conta...");

    try {
      if (isLogin) {
        const res = await signIn("credentials", { 
          email, 
          password, 
          redirect: false 
        });
        
        if (res?.error) throw new Error("E-mail ou senha incorretos");
        
        toast.success("Bem-vindo!", { id: load });
        router.push("/tasks");
        router.refresh();
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        await registerUser(formData);

        const res = await signIn("credentials", { 
          email, 
          password, 
          redirect: false 
        });

        if (res?.error) {
          toast.success("Conta criada! Por favor, faça login.", { id: load });
          setIsLogin(true);
        } else {
          toast.success("Conta criada e logada!", { id: load });
          router.push("/tasks");
          router.refresh();
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error(errorMessage, { id: load });
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {isLogin ? "Login" : "Criar Conta"}
          </h2>
          <p className="text-slate-400 mt-2">
            {isLogin ? "Acesse seu Task Manager" : "Comece a se organizar hoje"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Seu nome"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-95">
            {isLogin ? "Entrar" : "Cadastrar e Entrar"}
          </button>
        </form>

        <div className="flex flex-col gap-4">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça Login"}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">Ou</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/tasks" })}
            className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
}
