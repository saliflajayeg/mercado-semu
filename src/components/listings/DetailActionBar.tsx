"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DetailActionBar({ whatsappUrl }: { whatsappUrl: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  function showHint(message: string) {
    setHint(message);
    window.setTimeout(() => setHint(null), 2200);
  }

  return (
    <>
      {hint && (
        <div className="fixed inset-x-0 bottom-32 z-30 flex justify-center px-4">
          <div className="rounded-full bg-brand-ink px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-lg">
            {hint}
          </div>
        </div>
      )}
      <div className="fixed inset-x-0 bottom-16 z-20 mx-auto flex w-full max-w-md gap-2.5 border-t border-brand-line bg-white px-3.5 py-2.5">
        <button
          onClick={() => {
            setSaved((s) => !s);
            showHint(
              saved
                ? "Quitado de favoritos"
                : "Inicia sesión para guardar favoritos (pronto)",
            );
          }}
          aria-label="Guardar en favoritos"
          className="flex-none rounded-xl bg-brand-chip px-4 py-3.5 text-lg text-brand-navy"
        >
          {saved ? "❤️" : "🤍"}
        </button>
        <button
          onClick={() => router.push("/mensajes")}
          className="flex-1 rounded-xl bg-brand-navy py-3.5 text-sm font-extrabold text-white"
        >
          💬 Chatear
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl bg-brand-green py-3.5 text-center text-sm font-extrabold text-white"
        >
          📞 WhatsApp
        </a>
      </div>
    </>
  );
}
