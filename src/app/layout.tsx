import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import UserMenu from "@/components/UserMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerenciador de Tarefas",
  description: "Organize suas tarefas de forma simples e rápida",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50 min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
            <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
              <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-80 transition">
                Task<span className="text-blue-500">Manager</span>
              </Link>
              
              <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
                <Link href="/" className="hidden xs:inline hover:text-blue-400 transition">Home</Link>

                <UserMenu />
              </div>
            </nav>
          </header>

          <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
            {children}
          </main>

          <footer className="py-8 border-t border-slate-900 text-center text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} Task Manager - Isaque
          </footer>
          <Toaster 
            position="top-center" 
            toastOptions={{
              className: 'bg-slate-900 text-slate-50 border border-slate-800',
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}

