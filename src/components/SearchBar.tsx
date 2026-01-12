"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // Sempre reseta para a página 1 ao iniciar uma nova busca
    params.set("page", "1"); 
    
    router.push(`/tasks?${params.toString()}`);
  }

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Buscar tarefas..."
        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
