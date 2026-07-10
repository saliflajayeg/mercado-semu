import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/queries";
import { getPlan } from "@/lib/pricing";
import { PaymentInstructions } from "@/components/payments/PaymentInstructions";
import { PaymentReferenceForm } from "@/components/payments/PaymentReferenceForm";

export default async function SubscribePage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const { plan } = await params;
  const info = getPlan(plan);
  if (!info || info.priceXaf <= 0) notFound();

  const profile = await getSessionProfile();
  if (!profile) redirect("/entrar");

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 bg-brand-navy px-4 py-4 text-white">
        <Link href="/planes" aria-label="Volver" className="text-xl">
          ←
        </Link>
        <h2 className="text-base font-extrabold">Hazte {info.name}</h2>
      </header>

      <div className="p-4">
        <p className="mb-3 text-sm text-[#39425c]">
          Estás a un paso de activar <b>{info.name}</b>. Completa el pago con
          MuniDinero y envía la referencia.
        </p>
        <PaymentInstructions amountXaf={info.priceXaf} />
        <PaymentReferenceForm kind="subscription" plan={info.id} />
      </div>
    </div>
  );
}
