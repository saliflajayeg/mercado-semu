import Image from "next/image";
import Link from "next/link";

export function AppBar() {
  return (
    <header className="bg-brand-navy px-4 pt-3 pb-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Mercado Semu"
            width={44}
            height={44}
            priority
            className="h-11 w-11 object-contain"
          />
          <div className="leading-none">
            <h1 className="text-[17px] font-extrabold tracking-wide">
              MERCADO <span className="text-brand-green">SEMU</span>
            </h1>
            <p className="mt-0.5 text-[8px] font-bold tracking-[2px] text-[#b9c3e8]">
              VENDE · COMPRA · CONECTA
            </p>
          </div>
        </div>
        <button aria-label="Notificaciones" className="relative text-lg">
          🔔
          <span className="absolute -top-1.5 -right-1.5 rounded-full bg-brand-red px-[5px] text-[9px] font-bold">
            3
          </span>
        </button>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-[#c3cdf0]">
        📍 Malabo, Guinea Ecuatorial ⌄
      </div>
      <Link
        href="/buscar"
        className="mt-2.5 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[13px] text-brand-muted"
      >
        🔎 Buscar en Mercado Semu...
      </Link>
    </header>
  );
}
