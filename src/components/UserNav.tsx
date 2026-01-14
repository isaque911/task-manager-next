"use client";

import { useState } from "react";
import { LogOut, User, Settings, CheckCircle } from "lucide-react";
import { signOut } from "next-auth/react";

export default function UserNav({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none group"
      >
        <img 
          src={user.image || ""} 
          alt="Avatar" 
          className="w-9 h-9 rounded-full border-2 border-indigo-500 group-hover:border-indigo-400 transition-all"
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 py-2 animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-bold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition">
                <User size={18} /> Perfil
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition">
                <Settings size={18} /> Configurações
              </button>
            </div>

            <div className="p-2 border-t border-gray-50">
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut size={18} /> Sair da conta
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

