"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Espera 300ms parar de digitar para buscar (Performance)
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    
    // Reseta para página 1 se mudar a busca
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="mb-4">
      <input
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
        placeholder="Buscar tarefas..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}
