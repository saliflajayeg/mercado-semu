"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image";
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
  const [receipt, setReceipt] = useState<{ file: File; preview: string } | null>(
    null,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function onPickReceipt(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (receipt) URL.revokeObjectURL(receipt.preview);
    setReceipt({ file, preview: URL.createObjectURL(file) });
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeReceipt() {
    if (receipt) URL.revokeObjectURL(receipt.preview);
    setReceipt(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!receipt) {
      setError("Sube una foto del recibo de MuniDinero.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setBusy(false);
        setError("Inicia sesión para continuar.");
        return;
      }

      // Compress + upload the receipt screenshot to the user's storage folder.
      const blob = await compressImage(receipt.file, 1400, 0.85);
      const path = `${user.id}/receipts/${crypto.randomUUID()}.webp`;
      const { error: upErr } = await supabase.storage
        .from("listing-images")
        .upload(path, blob, { contentType: "image/webp", upsert: false });
      if (upErr) {
        setBusy(false);
        setError("No se pudo subir el recibo. Revisa tu conexión.");
        return;
      }
      const { data } = supabase.storage
        .from("listing-images")
        .getPublicUrl(path);
      const receiptUrl = data.publicUrl;

      const result =
        props.kind === "subscription"
          ? await submitSubscriptionPayment(props.plan, reference, receiptUrl)
          : await submitBoostPayment(props.listingId, reference, receiptUrl);

      if ("error" in result) {
        setBusy(false);
        setError(result.error);
        return;
      }
      router.push("/mis-pagos?enviado=1");
    } catch {
      setBusy(false);
      setError("Algo salió mal. Inténtalo de nuevo.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      {error && (
        <div className="mb-3 rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-brand-red">
          {error}
        </div>
      )}

      <label className="mb-1.5 block text-xs font-bold text-[#39425c]">
        Foto del recibo de MuniDinero <span className="text-brand-red">*</span>
      </label>
      {receipt ? (
        <div className="relative w-40 overflow-hidden rounded-xl border border-brand-line">
          <img src={receipt.preview} alt="Recibo" className="w-full object-cover" />
          <button
            type="button"
            onClick={removeReceipt}
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex h-28 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#c3ccdf] text-brand-muted"
        >
          <span className="text-2xl">🧾</span>
          <span className="text-[12.5px]">Sube la captura de tu envío</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onPickReceipt}
        className="hidden"
      />

      <label className="mb-1.5 mt-4 block text-xs font-bold text-[#39425c]">
        Referencia del pago{" "}
        <span className="font-normal text-brand-muted">(opcional)</span>
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
        {busy ? "Enviando..." : "Ya pagué, enviar comprobante"}
      </button>
    </form>
  );
}
