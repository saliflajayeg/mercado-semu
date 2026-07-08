export function AppBar() {
  return (
    <header className="bg-brand-navy px-4 pt-3 pb-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-lg">
            🛍️
          </span>
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
    </header>
  );
}
