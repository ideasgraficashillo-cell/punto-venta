"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signError) {
        const msg = signError.message.toLowerCase();
        if (
          msg.includes("invalid") ||
          msg.includes("credentials") ||
          msg.includes("wrong")
        ) {
          setError("Correo o contraseña incorrectos.");
        } else {
          setError(signError.message);
        }
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("No se pudo obtener la sesión.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_active")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        await supabase.auth.signOut();
        setError(
          "No se pudo verificar tu perfil. Si el problema continúa, revisa las políticas RLS en Supabase.",
        );
        return;
      }

      if (!profile) {
        await supabase.auth.signOut();
        setError(
          "No existe un perfil para esta cuenta. Contacta al administrador.",
        );
        return;
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        setError("Tu cuenta está desactivada. Contacta al administrador.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Punto de venta
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Inicia sesión para continuar
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          {error ? (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            >
              {error}
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 transition-[box-shadow,border-color] placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 transition-[box-shadow,border-color] placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <Link
            href="/"
            className="font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
          >
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
