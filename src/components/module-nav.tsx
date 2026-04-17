"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { MODULE_MENUS, type ModuleMenu } from "@/lib/module-menus";

type ModuleNavProps = {
  /** `header`: barra superior compacta y en fila */
  variant?: "default" | "header";
};

export function ModuleNav({ variant = "default" }: ModuleNavProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHeader = variant === "header";

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (containerRef.current?.contains(t)) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest?.("[data-module-submenu]")) return;
      setOpenId(null);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div
      ref={containerRef}
      className={
        isHeader
          ? "flex h-10 min-h-10 w-full min-w-0 max-w-full items-center overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "min-w-0 space-y-2"
      }
    >
      <div
        className={
          isHeader
            ? "flex h-10 w-max min-w-full flex-nowrap items-center justify-center gap-1 px-0.5 sm:gap-1.5"
            : "flex flex-col gap-2 md:flex-row md:flex-wrap md:items-start"
        }
      >
        {MODULE_MENUS.map((mod) => (
          <ModuleDropdown
            key={mod.id}
            mod={mod}
            compact={isHeader}
            isOpen={openId === mod.id}
            onToggle={() => toggle(mod.id)}
            onClose={() => setOpenId(null)}
          />
        ))}
      </div>
    </div>
  );
}

function ModuleDropdown({
  mod,
  compact,
  isOpen,
  onToggle,
  onClose,
}: {
  mod: ModuleMenu;
  compact?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [fixedPos, setFixedPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !compact || !btnRef.current) {
      setFixedPos(null);
      return;
    }

    function updatePosition() {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      const minW = 224;
      const width = Math.max(r.width, minW);
      let left = r.left;
      const padding = 8;
      if (left + width > window.innerWidth - padding) {
        left = Math.max(padding, window.innerWidth - width - padding);
      }
      left = Math.max(padding, left);
      setFixedPos({
        top: r.bottom + 4,
        left,
        width,
      });
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, compact]);

  const panelContent = (
    <>
      {mod.items.length === 0 ? (
        <p className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
          Sin submenús aún. Agrégalos en{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            module-menus.ts
          </code>
          .
        </p>
      ) : (
        <ul className="py-0.5">
          {mod.items.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="block px-3 py-2.5 text-sm text-zinc-800 transition hover:bg-violet-50 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed px-3 py-2.5 text-left text-sm text-zinc-400 dark:text-zinc-500"
                  title="Ruta pendiente"
                >
                  {item.label}
                  <span className="ml-1 text-[10px] font-normal text-zinc-400">
                    (pronto)
                  </span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const panelClass =
    "max-h-[min(70vh,20rem)] overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <div
      className={`relative min-w-0 ${compact ? "h-10 shrink-0" : "w-full md:w-auto md:min-w-[10.5rem]"}`}
    >
      <button
        ref={btnRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={`submenu-${mod.id}`}
        id={`module-trigger-${mod.id}`}
        onClick={onToggle}
        className={`flex items-center justify-between gap-1 rounded-lg bg-gradient-to-br text-left font-semibold shadow-md ring-1 transition hover:brightness-110 active:brightness-95 sm:gap-1.5 sm:rounded-xl ${compact ? "h-10 max-h-10 min-h-10 w-auto min-w-0 px-2 py-0 text-[10px] sm:px-2.5 sm:text-[11px]" : "w-full gap-2 px-3 py-3 text-xs sm:py-3.5 sm:text-sm"} ${mod.classes}`}
      >
        <span className="flex min-w-0 items-center gap-1 sm:gap-1.5">
          <span
            className={`flex shrink-0 items-center justify-center rounded-md bg-white/20 shadow-inner sm:rounded-md ${compact ? "h-7 w-7 text-sm leading-none sm:h-7 sm:w-7 sm:text-base" : "h-9 w-9 text-lg"}`}
            aria-hidden
          >
            {mod.icon}
          </span>
          <span
            className={
              compact
                ? "max-w-[3.25rem] truncate sm:max-w-[5rem] md:max-w-[6rem] lg:max-w-none"
                : "truncate"
            }
          >
            {mod.label}
          </span>
        </span>
        <span
          className={`shrink-0 text-white/90 transition-transform ${isOpen ? "rotate-180" : ""} ${compact ? "text-[9px] leading-none sm:text-[10px]" : ""}`}
          aria-hidden
        >
          ▼
        </span>
      </button>

      {isOpen && compact && mounted && fixedPos
        ? createPortal(
            <div
              data-module-submenu=""
              id={`submenu-${mod.id}`}
              role="region"
              aria-labelledby={`module-trigger-${mod.id}`}
              className={`fixed z-[200] ${panelClass}`}
              style={{
                top: fixedPos.top,
                left: fixedPos.left,
                width: fixedPos.width,
                maxWidth: "min(100vw - 1rem, 20rem)",
              }}
            >
              {panelContent}
            </div>,
            document.body,
          )
        : null}

      {isOpen && !compact ? (
        <div
          data-module-submenu=""
          id={`submenu-${mod.id}`}
          role="region"
          aria-labelledby={`module-trigger-${mod.id}`}
          className={`absolute z-50 mt-1 ${panelClass} left-0 right-0 md:left-0 md:right-auto md:min-w-[14rem]`}
        >
          {panelContent}
        </div>
      ) : null}
    </div>
  );
}
