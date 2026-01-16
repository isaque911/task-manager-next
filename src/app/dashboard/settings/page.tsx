import { requireUser } from "@/lib/auth-guard";

export default async function SettingsPage() {
  await requireUser();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <p className="text-slate-400">Página em desenvolvimento...</p>
    </div>
  );
}
