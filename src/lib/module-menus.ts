export type SubMenuItem = {
  label: string;
  /** `null` = aún no enlazado (se muestra deshabilitado) */
  href: string | null;
};

export type ModuleMenu = {
  id: string;
  label: string;
  icon: string;
  /** Clases Tailwind para el botón principal (gradiente) */
  classes: string;
  items: SubMenuItem[];
};

/**
 * Menú principal por módulo. Agrega entradas en `items` según vayas creando rutas.
 */
export const MODULE_MENUS: ModuleMenu[] = [
  {
    id: "ventas",
    label: "VENTAS",
    icon: "💰",
    classes:
      "from-emerald-500/90 to-emerald-600/90 text-white ring-emerald-300/40",
    items: [
      { label: "Caja", href: null },
      { label: "Reportes", href: null },
      { label: "Corte", href: null },
      { label: "Apertura / cierre", href: null },
      { label: "Arqueo", href: null },
      { label: "Devoluciones", href: null },
      { label: "Cotizaciones", href: null },
      { label: "Reimpresión de tickets", href: null },
    ],
  },
  {
    id: "compras",
    label: "COMPRAS",
    icon: "🛒",
    classes: "from-sky-500/90 to-blue-600/90 text-white ring-sky-300/40",
    items: [
      { label: "Nueva orden de compra", href: null },
      { label: "Proveedores", href: null },
    ],
  },
  {
    id: "almacen",
    label: "ALMACEN",
    icon: "📦",
    classes:
      "from-amber-500/90 to-orange-600/90 text-white ring-amber-300/40",
    items: [
      { label: "Inventario", href: null },
      { label: "Entradas / salidas", href: null },
    ],
  },
  {
    id: "cocina",
    label: "COCINA",
    icon: "👨‍🍳",
    classes: "from-cyan-500/90 to-teal-600/90 text-white ring-cyan-300/40",
    items: [
      { label: "Órdenes", href: null },
      { label: "Cocineros", href: null },
      { label: "Pedidos en preparación", href: null },
      { label: "Historial del turno", href: null },
    ],
  },
];
