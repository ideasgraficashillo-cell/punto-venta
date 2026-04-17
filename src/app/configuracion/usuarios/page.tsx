"use client";

import { useRouter } from "next/navigation";

export default function UsuariosPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-1 bg-zinc-100 p-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 sm:p-6">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Usuarios</h1>
          <button
            type="button"
            onClick={() => router.push("/configuracion")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Regresar
          </button>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Esta vista queda lista para el siguiente paso: alta y gestión de
          usuarios por rol.
        </p>
      </div>
    </div>
  );
}
