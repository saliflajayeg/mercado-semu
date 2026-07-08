"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/buscar", label: "Buscar", icon: "🔎" },
  { href: "/vender", label: "Vender", icon: "＋", isSell: true },
  { href: "/mensajes", label: "Mensajes", icon: "💬" },
  { href: "/perfil", label: "Perfil", icon: "👤" },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 inset-x-0 z-20 flex items-center justify-around border-t border-brand-line bg-white h-16 pb-safe">
      {TABS.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

        if ("isSell" in tab && tab.isSell) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative -top-3.5 flex flex-1 flex-col items-center gap-0.5"
            >
              <span className="flex h-13 w-13 items-center justify-center rounded-full bg-brand-green text-2xl text-white shadow-lg shadow-brand-green/50">
                {tab.icon}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold text-brand-green-dark">
                {tab.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold ${
              active ? "text-brand-green-dark" : "text-brand-muted"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
