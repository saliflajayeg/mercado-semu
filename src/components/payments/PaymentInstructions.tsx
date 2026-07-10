import { formatXAF } from "@/lib/format";
import { MUNIDINERO } from "@/lib/pricing";

export function PaymentInstructions({ amountXaf }: { amountXaf: number }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#39425c]">Total a pagar</span>
        <span className="text-xl font-black text-brand-navy">
          {formatXAF(amountXaf)}
        </span>
      </div>

      <div className="mt-3 rounded-xl bg-brand-bg p-3">
        <div className="flex items-center gap-2 text-[13px] font-extrabold text-brand-navy">
          <span className="text-lg">📲</span> Paga con MuniDinero
        </div>
        <ol className="mt-2 space-y-1.5 text-[12.5px] leading-snug text-[#39425c]">
          <li>
            1. Marca <b>{MUNIDINERO.ussd}</b> (opción 2 → 1) o abre la app de
            MuniDinero.
          </li>
          <li>
            2. Envía el importe exacto a:
            <div className="mt-1 rounded-lg border border-brand-line bg-white px-3 py-2">
              <div className="text-[15px] font-black tracking-wide text-brand-navy">
                {MUNIDINERO.number}
              </div>
              <div className="text-[11px] text-brand-muted">
                {MUNIDINERO.name}
              </div>
            </div>
          </li>
          <li>
            3. Copia la <b>referencia</b> de la transacción y pégala abajo.
          </li>
        </ol>
      </div>

      <p className="mt-3 text-[11px] leading-snug text-brand-muted">
        Un administrador confirmará tu pago y se activará automáticamente.
        Normalmente en pocas horas.
      </p>
    </div>
  );
}
