import type { Plan } from "@/lib/types";

export type PlanId = Plan; // 'basico' | 'pro' | 'premium'

export type PlanInfo = {
  id: PlanId;
  name: string;
  priceXaf: number; // monthly; 0 = free
  popular?: boolean;
  features: string[];
  cta: string;
};

export const PLANS: PlanInfo[] = [
  {
    id: "basico",
    name: "Básico",
    priceXaf: 0,
    features: [
      "Hasta 5 anuncios activos",
      "Chat con compradores",
      "Perfil público",
    ],
    cta: "Plan actual",
  },
  {
    id: "pro",
    name: "PRO",
    priceXaf: 9000,
    popular: true,
    features: [
      "Anuncios ilimitados",
      "Insignia de vendedor verificado ✔",
      "4 anuncios destacados al mes",
      "Estadísticas de visitas y contactos",
    ],
    cta: "Empezar con PRO",
  },
  {
    id: "premium",
    name: "Premium Negocio",
    priceXaf: 25000,
    features: [
      "Todo lo de PRO",
      "Tienda propia dentro de la app",
      "15 destacados + banner en portada",
      "Soporte prioritario",
    ],
    cta: "Elegir Premium",
  },
];

/** One-off boost: pushes a single listing to Destacados for 7 days. */
export const BOOST_PRICE_XAF = 2000;
export const BOOST_DAYS = 7;

export function getPlan(id: string): PlanInfo | undefined {
  return PLANS.find((p) => p.id === id);
}

/** Rank so we can tell whether a plan is an upgrade over the current one. */
export function planRank(id: PlanId): number {
  return { basico: 0, pro: 1, premium: 2 }[id];
}

/** MuniDinero payment details shown to sellers. Swap the number for the real
 *  one via NEXT_PUBLIC_MUNIDINERO_NUMBER when it's ready. */
export const MUNIDINERO = {
  number: process.env.NEXT_PUBLIC_MUNIDINERO_NUMBER ?? "222 00 00 00",
  name: process.env.NEXT_PUBLIC_MUNIDINERO_NAME ?? "Mercado Semu",
  ussd: "*423#",
};
