import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials" // 1. Importe o Provider
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

   
        if (!user || !user.password) return null;

        // Compara a senha digitada com o hash no banco
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return user;
      },
    }),
  ],
 
  session: { strategy: "jwt" },
  
  // Customiza a página de login para apontar para a nossa (que vamos criar)
  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  }
})

