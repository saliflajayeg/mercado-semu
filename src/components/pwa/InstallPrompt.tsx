"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "semu-install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    const nav = window.navigator as Navigator & { standalone?: boolean };
    const installed =
      window.matchMedia("(display-mode: standalone)").matches ||
      nav.standalone === true;
    if (installed) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS Safari never fires beforeinstallprompt → show a manual hint instead.
    const ua = nav.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|android/i.test(ua);
    if (isIOS && isSafari) {
      // Legitimate one-time environment check on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIosHint(true);
      setVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  }

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 mx-auto w-full max-w-md px-3 pb-2">
      <div className="flex items-center gap-3 rounded-2xl border border-brand-line bg-white p-3 shadow-[0_10px_30px_rgba(16,28,78,0.18)]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-lg">
          📲
        </span>
        <div className="min-w-0 flex-1">
          <b className="block text-[13px] text-brand-navy">
            Instala Mercado Semu
          </b>
          <p className="text-[11px] leading-snug text-brand-muted">
            {iosHint
              ? "Pulsa Compartir y luego “Añadir a inicio”."
              : "Ábrelo como una app, más rápido y sin buscar el enlace."}
          </p>
        </div>
        {!iosHint && (
          <button
            onClick={install}
            className="shrink-0 rounded-lg bg-brand-green px-3 py-2 text-[12px] font-extrabold text-white"
          >
            Instalar
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="shrink-0 text-brand-muted"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
