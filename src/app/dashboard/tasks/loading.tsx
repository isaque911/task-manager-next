import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-6">
        
        {/* Título */}
        <Skeleton className="h-7 w-40" />

        {/* Input + botão */}
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Lista de tarefas */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>

        {/* Resumo */}
        <Skeleton className="h-4 w-56" />

        {/* Paginação */}
        <div className="flex justify-between pt-4 border-t border-slate-800">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>

      </div>
    </div>
  );
}

