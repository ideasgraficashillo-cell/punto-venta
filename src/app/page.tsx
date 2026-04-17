"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ModuleNav } from "@/components/module-nav";
import { supabase } from "@/lib/supabase";

type Profile = {
  full_name: string | null;
  role: string;
  is_active: boolean;
};

type StoreSettingsRow = {
  store_name: string | null;
  location: string | null;
  phone: string | null;
  contact_email: string | null;
  currency: string | null;
  timezone: string | null;
  tax_name: string | null;
  tax_id: string | null;
  logo_url: string | null;
  updated_at: string | null;
};

const ADMIN_ROLES = new Set(["admin", "administrador"]);

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [store, setStore] = useState<StoreSettingsRow | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUserData() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role, is_active")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (profileError || !profileData) {
        setError(
          "No se pudo cargar el perfil del usuario. Revisa la configuración de Supabase.",
        );
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: storeData } = await supabase
        .from("store_settings")
        .select(
          "store_name, location, phone, contact_email, currency, timezone, tax_name, tax_id, logo_url, updated_at",
        )
        .eq("created_by", user.id)
        .maybeSingle();

      if (!mounted) return;
      setStore(storeData ?? null);
      setLoading(false);
    }

    loadUserData();

    return () => {
      mounted = false;
    };
  }, [router]);

  const isAdmin = useMemo(() => {
    if (!profile?.role) return false;
    return ADMIN_ROLES.has(profile.role.toLowerCase());
  }, [profile?.role]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Cargando menú principal...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile?.is_active) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-md rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          <p>Tu cuenta está desactivada. Contacta al administrador.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Este usuario no tiene vista de administrador.
          </p>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Rol detectado: <span className="font-semibold">{profile.role}</span>
          </p>
        </div>
      </div>
    );
  }

  const headerActions = (
    <>
      <button
        type="button"
        onClick={() => router.push("/configuracion")}
        aria-label="Configuración"
        title="Configuración"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 bg-white text-lg transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
      >
        <span aria-hidden="true">⚙️</span>
      </button>
      <button
        type="button"
        onClick={handleSignOut}
        aria-label="Salir"
        title="Salir"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-300/60 bg-red-50 text-lg text-red-700 transition-colors hover:bg-red-100 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950/80"
      >
        <span aria-hidden="true">🚪</span>
      </button>
    </>
  );

  return (
    <div className="relative flex min-h-full min-w-0 flex-1 flex-col overflow-x-hidden bg-gradient-to-br from-zinc-100 via-white to-violet-50/80 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-violet-950/40 dark:text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

      <header className="relative z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="mx-auto flex h-12 min-h-12 w-full max-w-[1800px] items-center gap-2 px-2 py-1.5 sm:gap-3 sm:px-4">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-600 dark:bg-zinc-800"
              title={store?.store_name?.trim() || "Mi tienda"}
            >
              {store?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${store.logo_url}${store.logo_url.includes("?") ? "&" : "?"}v=${encodeURIComponent(store.updated_at ?? "")}`}
                  alt={
                    store?.store_name?.trim()
                      ? `Logo ${store.store_name}`
                      : "Logo de la tienda"
                  }
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="text-xl" aria-hidden>
                  🏬
                </span>
              )}
            </div>
            <div className="hidden min-w-0 max-w-[8.5rem] flex-col justify-center leading-none sm:flex sm:max-w-[14rem]">
              <p className="truncate text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                Punto de Venta
              </p>
              <p className="truncate text-sm font-semibold leading-tight">
                {profile.full_name || "Administrador"}
              </p>
              <p className="truncate text-[9px] uppercase tracking-wide text-zinc-500">
                Rol: {profile.role}
              </p>
            </div>
            <p
              className="max-w-[6rem] truncate text-xs font-semibold leading-none sm:hidden"
              title={profile.full_name || ""}
            >
              {profile.full_name || "Admin"}
            </p>
          </div>

          <div className="flex min-h-10 min-w-0 flex-1 items-center">
            <ModuleNav variant="header" />
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {headerActions}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex min-w-0 flex-1 flex-col px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
        <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col gap-4 sm:gap-6">
          <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-xl shadow-violet-500/5 backdrop-blur-sm sm:rounded-3xl dark:border-zinc-700/80 dark:bg-zinc-900/90">
            <div className="relative bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="flex min-w-0 flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white/30 bg-white/15 shadow-lg backdrop-blur-md sm:h-28 sm:w-28">
                    {store?.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${store.logo_url}${store.logo_url.includes("?") ? "&" : "?"}v=${encodeURIComponent(store.updated_at ?? "")}`}
                        alt=""
                        className="h-full w-full rounded-xl object-contain p-2"
                      />
                    ) : (
                      <span className="text-5xl drop-shadow-md" aria-hidden>
                        🏬
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 max-w-full text-center sm:text-left">
                    <p className="text-xs font-medium uppercase tracking-widest text-white/80 sm:text-sm">
                      Bienvenido
                    </p>
                    <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                      {store?.store_name?.trim() ||
                        process.env.NEXT_PUBLIC_APP_NAME ||
                        "Mi tienda"}
                    </h1>
                    {store?.location?.trim() ? (
                      <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-white/90 [overflow-wrap:anywhere] break-words sm:justify-start sm:text-base">
                        <span aria-hidden className="shrink-0">
                          📍
                        </span>
                        <span>{store.location}</span>
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-white/75 sm:text-sm">
                        Agrega la ubicación en Configuración → Mi tienda
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  href="/configuracion/mi-tienda"
                  className="inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/25 sm:w-auto sm:py-2.5"
                >
                  Editar datos
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-px bg-zinc-200/80 sm:grid-cols-2 lg:grid-cols-3 dark:bg-zinc-700/80">
              <InfoTile
                icon="📞"
                label="Teléfono"
                value={store?.phone?.trim()}
              />
              <InfoTile
                icon="✉️"
                label="Correo"
                value={store?.contact_email?.trim()}
              />
              <InfoTile
                icon="💱"
                label="Moneda"
                value={store?.currency?.trim() || "—"}
              />
              <InfoTile
                icon="🌐"
                label="Zona horaria"
                value={store?.timezone?.trim() || "—"}
              />
              <InfoTile
                icon="🏢"
                label="Razón social"
                value={store?.tax_name?.trim()}
              />
              <InfoTile
                icon="📋"
                label="RFC / NIF"
                value={store?.tax_id?.trim()}
              />
            </div>
          </section>

          {!store?.store_name?.trim() && (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-3 text-sm text-amber-950 sm:rounded-2xl sm:px-4 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
              Aún no has registrado el nombre de la tienda.{" "}
              <Link
                href="/configuracion/mi-tienda"
                className="font-semibold underline underline-offset-2"
              >
                Completa Mi tienda
              </Link>{" "}
              para ver aquí todos los datos.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string | null;
}) {
  const hasValue = Boolean(value?.trim());
  return (
    <div className="bg-white p-3 sm:p-4 md:p-5 dark:bg-zinc-900">
      <div className="flex items-start gap-2 sm:gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-base sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg dark:bg-violet-950/60"
          aria-hidden
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p
            className={`mt-0.5 text-xs font-medium leading-snug [overflow-wrap:anywhere] break-words sm:text-sm ${hasValue ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500"}`}
          >
            {hasValue ? value : "Sin registrar"}
          </p>
        </div>
      </div>
    </div>
  );
}
