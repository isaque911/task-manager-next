import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
      <div className="text-xs text-slate-500">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex gap-2">
        <Link
          href={`/tasks?page=${currentPage - 1}`}
          className={`p-2 rounded bg-slate-800 hover:bg-slate-700 ${!hasPrevPage ? "pointer-events-none opacity-50" : ""}`}
        >
          <ChevronLeft size={16} />
        </Link>
        <Link
          href={`/tasks?page=${currentPage + 1}`}
          className={`p-2 rounded bg-slate-800 hover:bg-slate-700 ${!hasNextPage ? "pointer-events-none opacity-50" : ""}`}
        >
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
