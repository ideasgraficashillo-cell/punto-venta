"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type StoreSettings = {
  store_name: string;
  location: string;
  phone: string;
  contact_email: string;
  currency: string;
  timezone: string;
  tax_name: string;
  tax_id: string;
  logo_url: string;
};

const INITIAL_FORM: StoreSettings = {
  store_name: "",
  location: "",
  phone: "",
  contact_email: "",
  currency: "MXN",
  timezone: "America/Mexico_City",
  tax_name: "",
  tax_id: "",
  logo_url: "",
};

export default function MiTiendaPage() {
  const router = useRouter();
  const [form, setForm] = useState<StoreSettings>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  /** Evita que el navegador muestre el PNG viejo: la URL pública no cambia al hacer upsert del mismo archivo. */
  const [logoVersion, setLogoVersion] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: loadError } = await supabase
        .from("store_settings")
        .select(
          "store_name, location, phone, contact_email, currency, timezone, tax_name, tax_id, logo_url",
        )
        .eq("created_by", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (loadError) {
        setError(
          "No se pudo cargar la configuración. Aplica la migración 003_store_settings.sql en Supabase.",
        );
        setLoading(false);
        return;
      }

      if (data) {
        setForm({
          store_name: data.store_name ?? "",
          location: data.location ?? "",
          phone: data.phone ?? "",
          contact_email: data.contact_email ?? "",
          currency: data.currency ?? "MXN",
          timezone: data.timezone ?? "America/Mexico_City",
          tax_name: data.tax_name ?? "",
          tax_id: data.tax_id ?? "",
          logo_url: data.logo_url ?? "",
        });
        if (data.logo_url) {
          setLogoVersion(Date.now());
        }
      }

      setLoading(false);
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, [router]);

  function handleChange(
    key: keyof StoreSettings,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    setMessage(null);
    setError(null);
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setLogoFile(null);
      return;
    }

    if (file.type !== "image/png") {
      setError("El logo debe ser un archivo PNG.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("El logo no debe superar 2MB.");
      event.target.value = "";
      return;
    }

    setLogoFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      let logoUrl = form.logo_url;

      if (logoFile) {
        const filePath = `${user.id}/logo.png`;
        const { error: uploadError } = await supabase.storage
          .from("store-logos")
          .upload(filePath, logoFile, {
            cacheControl: "60",
            upsert: true,
            contentType: "image/png",
          });

        if (uploadError) {
          setError(
            "No se pudo subir el logo. Verifica el bucket y políticas de Storage.",
          );
          setSaving(false);
          return;
        }

        const { data: logoData } = supabase.storage
          .from("store-logos")
          .getPublicUrl(filePath);
        logoUrl = logoData.publicUrl;
      }

      const payload = {
        created_by: user.id,
        store_name: form.store_name.trim(),
        location: form.location.trim(),
        phone: form.phone.trim(),
        contact_email: form.contact_email.trim(),
        currency: form.currency.trim().toUpperCase(),
        timezone: form.timezone.trim(),
        tax_name: form.tax_name.trim(),
        tax_id: form.tax_id.trim(),
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from("store_settings")
        .upsert(payload, { onConflict: "created_by" });

      if (upsertError) {
        setError(
          "No se pudo guardar la configuración. Revisa políticas y estructura de la tabla.",
        );
        setSaving(false);
        return;
      }

      setForm((prev) => ({ ...prev, logo_url: logoUrl }));
      setLogoFile(null);
      setLogoVersion(Date.now());
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setMessage("Datos de la tienda guardados correctamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-100 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Cargando configuración...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 bg-zinc-100 p-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 sm:p-6">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-5 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Configuración
            </p>
            <h1 className="text-xl font-bold sm:text-2xl">Mi tienda</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push("/configuracion")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Regresar
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          {error ? (
            <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
              {message}
            </p>
          ) : null}

          <section className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nombre de la tienda"
              required
              value={form.store_name}
              onChange={(e) => handleChange("store_name", e)}
            />
            <Field
              label="Ubicación"
              value={form.location}
              onChange={(e) => handleChange("location", e)}
            />
            <Field
              label="Teléfono"
              value={form.phone}
              onChange={(e) => handleChange("phone", e)}
            />
            <Field
              label="Correo de contacto"
              type="email"
              value={form.contact_email}
              onChange={(e) => handleChange("contact_email", e)}
            />
            <Field
              label="Moneda"
              value={form.currency}
              onChange={(e) => handleChange("currency", e)}
            />
            <Field
              label="Zona horaria"
              value={form.timezone}
              onChange={(e) => handleChange("timezone", e)}
            />
            <Field
              label="Razón social"
              value={form.tax_name}
              onChange={(e) => handleChange("tax_name", e)}
            />
            <Field
              label="RFC / NIF"
              value={form.tax_id}
              onChange={(e) => handleChange("tax_id", e)}
            />
          </section>

          <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
            <p className="text-sm font-semibold">Logo de la tienda (PNG)</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Recomendado: 512x512, fondo transparente, máximo 2MB.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              onChange={handleLogoChange}
              className="mt-3 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-white hover:file:bg-zinc-700 dark:file:bg-zinc-100 dark:file:text-zinc-900 dark:hover:file:bg-zinc-300"
            />
            <LogoPreview
              logoFile={logoFile}
              logoUrl={form.logo_url}
              logoVersion={logoVersion}
            />
            {logoFile ? (
              <p className="mt-2 text-xs text-violet-600 dark:text-violet-400">
                Vista previa del archivo nuevo. Pulsa &quot;Guardar cambios&quot;
                para subirlo.
              </p>
            ) : null}
          </section>

          <section className="rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
            <p className="text-sm font-semibold">
              Ideas de datos generales recomendados
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
              <li>Nombre legal/fiscal y RFC para facturación.</li>
              <li>Teléfono y correo de contacto principal.</li>
              <li>Moneda, zona horaria y país operativo.</li>
              <li>Dirección completa y referencias de ubicación.</li>
              <li>Número de ticket o prefijo de folios de venta.</li>
            </ul>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
};

function LogoPreview({
  logoFile,
  logoUrl,
  logoVersion,
}: {
  logoFile: File | null;
  logoUrl: string;
  logoVersion: number;
}) {
  const localPreview = useMemo(() => {
    if (!logoFile) return null;
    return URL.createObjectURL(logoFile);
  }, [logoFile]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const remoteSrc =
    logoUrl.trim() && !logoFile
      ? `${logoUrl.trim()}${logoUrl.includes("?") ? "&" : "?"}v=${logoVersion}`
      : null;

  const src = localPreview ?? remoteSrc;
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- URL pública de Storage; cache-bust con ?v=
    <img
      src={src}
      alt="Logo de la tienda"
      className="mt-3 h-24 w-24 rounded-lg border border-zinc-200 bg-white object-contain p-2 dark:border-zinc-700"
    />
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = "text",
}: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={onChange}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      />
    </label>
  );
}
