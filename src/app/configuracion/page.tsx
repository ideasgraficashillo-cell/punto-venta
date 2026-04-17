"use client";

import { useRouter } from "next/navigation";

const SETTINGS_ITEMS = [
  {
    label: "USUARIOS",
    icon: "👥",
    href: "/configuracion/usuarios",
    description: "Alta, edición y permisos de usuarios del sistema.",
    classes:
      "from-indigo-500/90 to-blue-600/90 text-white ring-indigo-300/40",
  },
  {
    label: "MI TIENDA",
    icon: "🏪",
    href: "/configuracion/mi-tienda",
    description: "Datos generales, contacto, zona horaria y configuración base.",
    classes:
      "from-emerald-500/90 to-teal-600/90 text-white ring-emerald-300/40",
  },
];

export default function ConfiguracionPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-1 bg-zinc-100 p-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 sm:p-6">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-5 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Configuración
            </p>
            <h1 className="text-xl font-bold sm:text-2xl">Panel de ajustes</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Regresar
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SETTINGS_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => router.push(item.href)}
              className={`flex min-h-52 flex-col items-start justify-between rounded-2xl bg-gradient-to-br p-5 text-left shadow-md ring-1 transition-transform hover:scale-[1.01] ${item.classes}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl">
                {item.icon}
              </span>
              <div>
                <h2 className="text-lg font-bold">{item.label}</h2>
                <p className="mt-2 text-sm text-white/90">{item.description}</p>
              </div>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
