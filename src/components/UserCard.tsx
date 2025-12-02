interface UserCardProps {
  name: string;
  email: string;
  role?: "ADMIN" | "USER";
}

function UserCard({ name, email, role = "USER" }: UserCardProps) {
  const isAdmin = role === "ADMIN";

  return (
    <div className="w-80 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">{name}</h1>
        <span
          className={`text-2xl font-semibold rounded-full ml-2 ${
            isAdmin
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-slate-700 text-slate-200"
          }`}
        >
          {role}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-300">{email}</p>
    </div>
  );
}

export default UserCard;
