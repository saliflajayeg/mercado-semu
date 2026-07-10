import Link from "next/link";
import { getSessionProfile } from "@/lib/queries";
import { PLANS, planRank, BOOST_PRICE_XAF } from "@/lib/pricing";
import { formatXAF } from "@/lib/format";

export default async function PlanesPage() {
  const profile = await getSessionProfile();
  const currentPlan = profile?.plan ?? "basico";

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 bg-brand-navy px-4 py-4 text-white">
        <Link href="/perfil" aria-label="Volver" className="text-xl">
          ←
        </Link>
        <h2 className="text-base font-extrabold">Planes de vendedor</h2>
      </header>

      <div className="p-4">
        <h3 className="text-center text-[15px] font-extrabold">
          Vende más con Mercado Semu
        </h3>
        <p className="mb-4 text-center text-xs text-brand-muted">
          Elige el plan que impulse tu negocio
        </p>

        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isDowngrade = planRank(plan.id) < planRank(currentPlan);
          const free = plan.priceXaf === 0;

          return (
            <div
              key={plan.id}
              className={`relative mb-3 rounded-2xl border bg-white p-4 ${
                plan.popular
                  ? "border-brand-green shadow-[0_8px_22px_rgba(108,179,63,0.18)]"
                  : "border-brand-line"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-brand-green px-2.5 py-0.5 text-[9.5px] font-extrabold tracking-wide text-white">
                  MÁS POPULAR
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <b className="text-[15px]">{plan.name}</b>
                <span className="text-lg font-black text-brand-navy">
                  {free ? "Gratis" : formatXAF(plan.priceXaf)}
                  {!free && (
                    <small className="text-[11px] font-semibold text-brand-muted">
                      {" "}
                      /mes
                    </small>
                  )}
                </span>
              </div>
              <ul className="mt-2.5 flex flex-col gap-1.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-[#39425c]"
                  >
                    <span className="font-black text-brand-green-dark">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="mt-3 w-full rounded-xl bg-brand-chip py-2.5 text-center text-[13px] font-bold text-brand-muted">
                  Plan actual
                </div>
              ) : isDowngrade ? (
                <div className="mt-3 w-full rounded-xl bg-brand-chip py-2.5 text-center text-[13px] font-bold text-brand-muted">
                  Incluido en tu plan
                </div>
              ) : (
                <Link
                  href={`/planes/${plan.id}`}
                  className={`mt-3 block w-full rounded-xl py-2.5 text-center text-[13px] font-extrabold ${
                    plan.popular
                      ? "bg-brand-green text-white"
                      : "bg-brand-navy text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          );
        })}

        <p className="mt-1 text-center text-xs text-brand-muted">
          También puedes destacar anuncios sueltos desde{" "}
          {formatXAF(BOOST_PRICE_XAF)} sin suscripción, desde{" "}
          <Link href="/mis-anuncios" className="font-semibold text-brand-green-dark">
            Mis anuncios
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
