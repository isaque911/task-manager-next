import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  return session.user;
}

