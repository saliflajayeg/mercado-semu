import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile, getPendingPayments } from "@/lib/queries";
import { formatXAF, formatRelativeTime } from "@/lib/format";
import { PaymentActions } from "./PaymentActions";

export default async function AdminPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/entrar");
  if (!profile.is_admin) redirect("/");

  const pending = await getPendingPayments();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 bg-brand-navy px-4 py-4 text-white">
        <Link href="/perfil" aria-label="Volver" className="text-xl">
          ←
        </Link>
        <h2 className="text-base font-extrabold">Panel de administrador</h2>
      </header>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-brand-navy">
            Pagos pendientes
          </h3>
          <span className="rounded-full bg-brand-chip px-2 py-0.5 text-[11px] font-bold text-brand-navy">
            {pending.length}
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <span className="text-4xl">✅</span>
            <p className="text-sm text-brand-muted">
              No hay pagos pendientes. Todo al día.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-brand-line bg-white p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-brand-navy">
                      {p.type === "subscription"
                        ? `Suscripción ${p.plan?.toUpperCase() ?? ""}`
                        : `Destacar anuncio`}
                    </div>
                    {p.type === "boost" && (
                      <div className="mt-0.5 truncate text-[11px] text-brand-muted">
                        {p.listing?.title ?? "anuncio"}
                      </div>
                    )}
                  </div>
                  <span className="shrink-0 text-[15px] font-black text-brand-navy">
                    {formatXAF(p.amount_xaf)}
                  </span>
                </div>

                <div className="mt-2 rounded-xl bg-brand-bg px-3 py-2 text-[12px] text-[#39425c]">
                  <div>
                    <b>Vendedor:</b> {p.user?.full_name ?? "—"}
                    {p.user?.phone ? ` · ${p.user.phone}` : ""}
                  </div>
                  {p.reference && (
                    <div>
                      <b>Referencia:</b> {p.reference}
                    </div>
                  )}
                  <div className="text-brand-muted">
                    {formatRelativeTime(p.created_at)}
                  </div>
                </div>

                {p.receipt_url ? (
                  <a
                    href={p.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block overflow-hidden rounded-xl border border-brand-line"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.receipt_url}
                      alt="Recibo de MuniDinero"
                      className="max-h-56 w-full object-contain bg-brand-bg"
                    />
                    <span className="block bg-white py-1.5 text-center text-[11px] font-bold text-brand-navy">
                      🧾 Ver recibo completo
                    </span>
                  </a>
                ) : (
                  <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">
                    Sin recibo adjunto
                  </div>
                )}

                <PaymentActions paymentId={p.id} />
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 text-center text-[11px] text-brand-muted">
          Al confirmar, el plan o el destacado se activan automáticamente.
        </p>
      </div>
    </div>
  );
}
