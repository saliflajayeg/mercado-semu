/** Formats whole-number XAF amounts as "12.000 FCFA" (dot thousands separator, no decimals). */
export function formatXAF(amount: number): string {
  return `${new Intl.NumberFormat("de-DE").format(Math.round(amount))} FCFA`;
}
