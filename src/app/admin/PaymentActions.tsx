"use client";

import { useTransition } from "react";
import { confirmPayment, rejectPayment } from "./actions";

export function PaymentActions({ paymentId }: { paymentId: string }) {
  const [pending, start] = useTransition();

  return (
    <div className="mt-3 flex gap-2">
      <button
        disabled={pending}
        onClick={() => start(() => confirmPayment(paymentId))}
        className="flex-1 rounded-xl bg-brand-green py-2.5 text-[13px] font-extrabold text-white disabled:opacity-50"
      >
        ✓ Confirmar
      </button>
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("¿Rechazar este pago?")) start(() => rejectPayment(paymentId));
        }}
        className="flex-1 rounded-xl border border-brand-line py-2.5 text-[13px] font-bold text-brand-red disabled:opacity-50"
      >
        Rechazar
      </button>
    </div>
  );
}
