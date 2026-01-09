"use client";
import { useState, useEffect } from "react";
import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import Button from "@/components/Button";

export default function HomePage() {
  const [view, setView] = useState<"home" | "about">("home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-50">
      <h1 className="text-3xl font-bold">Plataforma Fullstack</h1>
      {view === "home" && (
        <>
          <Card title="Usuário atual">
            <UserCard
              name="Isaque"
              email="emailexample@exempla.com"
              role="ADMIN"
            />
          </Card>
        </>
      )}
      {view === "about" && <></>}
      <div className="flex gap-2">
        <Button
          label="Home"
          variant={view === "home" ? "primary" : "secondary"}
          onClick={() => setView("home")}
        />
        <Button
          label="Sobre"
          variant={view === "about" ? "primary" : "secondary"}
          onClick={() => setView("about")}
        />
      </div>
    </div>
  );
}
