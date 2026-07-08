/** Formats whole-number XAF amounts as "12.000 FCFA" (dot thousands separator, no decimals). */
export function formatXAF(amount: number): string {
  return `${new Intl.NumberFormat("de-DE").format(Math.round(amount))} FCFA`;
}

/** Short Spanish relative time, e.g. "hace 2 h", "hace 3 días". */
export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} ${d === 1 ? "día" : "días"}`;
  const w = Math.floor(d / 7);
  if (d < 30) return `hace ${w} sem`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `hace ${mo} ${mo === 1 ? "mes" : "meses"}`;
  const y = Math.floor(d / 365);
  return `hace ${y} ${y === 1 ? "año" : "años"}`;
}

/** Builds a wa.me deep link with a prefilled Spanish message about a listing. */
export function whatsappLink(phone: string, listingTitle: string): string {
  const digits = phone.replace(/\D/g, "");
  const text = encodeURIComponent(
    `Hola, vi tu anuncio "${listingTitle}" en Mercado Semu. ¿Sigue disponible?`,
  );
  return `https://wa.me/${digits}?text=${text}`;
}
