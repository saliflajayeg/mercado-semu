"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  submitSubscriptionPayment,
  submitBoostPayment,
} from "@/app/pagos/actions";
import type { PlanId } from "@/lib/pricing";

type Props =
  | { kind: "subscription"; plan: PlanId }
  | { kind: "boost"; listingId: string };

export function PaymentReferenceForm(props: Props) {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!reference.trim()) {
      setError("Escribe la referencia del pago.");
      return;
    }
    setBusy(true);
    const result =
      props.kind === "subscription"
        ? await submitSubscriptionPayment(props.plan, reference)
        : await submitBoostPayment(props.listingId, reference);
    if ("error" in result) {
      setBusy(false);
      setError(result.error);
      return;
    }
    router.push("/mis-pagos?enviado=1");
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      {error && (
        <div className="mb-3 rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-brand-red">
          {error}
        </div>
      )}
      <label className="mb-1.5 block text-xs font-bold text-[#39425c]">
        Referencia del pago de MuniDinero
      </label>
      <input
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        className="w-full rounded-xl border border-brand-line bg-white px-3 py-3 text-sm outline-none focus:border-brand-green"
        placeholder="Ej: MD-8FQ2K7"
      />
      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-xl bg-brand-green py-3.5 text-[15px] font-extrabold text-white disabled:opacity-60"
      >
        {busy ? "Enviando..." : "Ya pagué, enviar referencia"}
      </button>
    </form>
  );
}
