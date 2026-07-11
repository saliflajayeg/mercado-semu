import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile, getMyPayments } from "@/lib/queries";
import { formatXAF, formatRelativeTime } from "@/lib/format";

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmado", className: "bg-green-100 text-brand-green-dark" },
  rejected: { label: "Rechazado", className: "bg-red-100 text-brand-red" },
};

export default async function MisPagosPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string }>;
}) {
  const profile = await getSessionProfile();
  if (!profile) redirect("/entrar");

  const { enviado } = await searchParams;
  const payments = await getMyPayments(profile.id);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 bg-brand-navy px-4 py-4 text-white">
        <Link href="/perfil" aria-label="Volver" className="text-xl">
          ←
        </Link>
        <h2 className="text-base font-extrabold">Mis pagos</h2>
      </header>

      <div className="p-4">
        {enviado && (
          <div className="mb-4 rounded-xl bg-green-50 px-3 py-3 text-[13px] font-semibold text-brand-green-dark">
            ✅ Referencia enviada. Un administrador confirmará tu pago pronto y
            se activará automáticamente.
          </div>
        )}

        {payments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="text-4xl">🧾</span>
            <p className="text-sm text-brand-muted">
              Aún no tienes pagos. Cuando te hagas PRO o destaques un anuncio,
              aparecerán aquí.
            </p>
            <Link
              href="/planes"
              className="rounded-xl bg-brand-green px-5 py-3 text-sm font-extrabold text-white"
            >
              Ver planes
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {payments.map((p) => {
              const s = STATUS[p.status];
              const title =
                p.type === "subscription"
                  ? `Suscripción ${p.plan?.toUpperCase() ?? ""}`
                  : `Destacar: ${p.listing?.title ?? "anuncio"}`;
              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-brand-line bg-white p-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[13.5px] font-bold text-brand-navy">
                        {title}
                      </div>
                      <div className="mt-0.5 text-[11px] text-brand-muted">
                        Ref: {p.reference} · {formatRelativeTime(p.created_at)}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${s.className}`}
                    >
                      {s.label}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[15px] font-black text-brand-navy">
                      {formatXAF(p.amount_xaf)}
                    </span>
                    {p.receipt_url && (
                      <a
                        href={p.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-bold text-brand-green-dark"
                      >
                        🧾 Ver recibo
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
