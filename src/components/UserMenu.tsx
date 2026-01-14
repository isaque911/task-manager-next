import { auth } from "@/auth";
import UserNav from "./UserNav";
import Link from "next/link";

export default async function UserMenu() {
  const session = await auth();

  // Se não estiver logado, mostra o botão de entrar
  if (!session?.user) {
    return (
      <Link 
        href="/api/auth/signin" 
        className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
      >
        Entrar
      </Link>
    );
  }

  // Se estiver logado, passa o usuário para o componente Client
  return <UserNav user={session.user} />;
}

