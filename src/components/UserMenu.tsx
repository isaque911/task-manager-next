"use client";

import { signOut, useSession } from "next-auth/react"; // Hooks do cliente
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session) return null; // Se não tiver logado, não mostra nada

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Foto do usuário"
            width={32}
            height={32}
            className="rounded-full border border-slate-700"
          />
        )}
        <span className="text-sm font-medium text-slate-200 hidden sm:block">
          {session.user?.name}
        </span>
      </div>

      <button
        onClick={() => signOut()}
        className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
        title="Sair"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}
