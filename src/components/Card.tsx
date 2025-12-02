interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-4 mb-4">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
