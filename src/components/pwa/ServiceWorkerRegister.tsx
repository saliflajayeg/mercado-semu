"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // In development the service worker's cache-first strategy serves stale
    // JS/CSS (dev chunk URLs are reused with new content), so only run it in
    // production. In dev, actively unregister any previously installed worker
    // and clear its caches so hot-reload works.
    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal: app still works without offline support.
      });
    } else {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
    }
  }, []);

  return null;
}
