import { requireUser } from "@/lib/auth-guard";

export default async function StatsPage() {
  await requireUser();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Estatísticas</h1>
      <p className="text-slate-400">Página em desenvolvimento...</p>
    </div>
  );
}
