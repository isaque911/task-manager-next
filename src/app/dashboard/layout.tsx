import { auth } from "@/auth";
import UserMenu from "@/components/UserMenu";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // O acesso é garantido pelo middleware

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 p-4 flex justify-between items-center">
        <Link href="/dashboard" className="font-bold text-xl uppercase tracking-wider text-blue-500">
          TaskApp
        </Link>
        <UserMenu />
      </header>
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
