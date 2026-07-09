import Link from "next/link";
import { getSessionProfile, getListingStats } from "@/lib/queries";
import { logoutAction } from "@/app/entrar/actions";

const PLAN_LABEL: Record<string, string> = {
  basico: "Gratis",
  pro: "PRO",
  premium: "Premium",
};

export default async function PerfilPage() {
  const profile = await getSessionProfile();

  // Logged out → invite to sign in.
  if (!profile) {
    return (
      <div className="flex flex-1 flex-col">
        <header className="bg-brand-navy px-4 py-4 text-white">
          <h2 className="text-base font-extrabold">Perfil</h2>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
          <span className="text-4xl">👤</span>
          <p className="text-sm text-brand-muted">
            Inicia sesión o crea una cuenta para vender, guardar favoritos y
            chatear con vendedores.
          </p>
          <Link
            href="/entrar"
            className="w-full rounded-xl bg-brand-green py-3.5 text-sm font-extrabold text-white"
          >
            Iniciar sesión / Crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  const stats = await getListingStats(profile.id);
  const initial = (profile.full_name ?? "?").charAt(0).toUpperCase();
  const memberSince = new Date(profile.created_at).getFullYear();

  const menuItems = [
    { icon: "⚡", label: "Planes de vendedor", href: "/planes", badge: PLAN_LABEL[profile.plan] },
    { icon: "➕", label: "Publicar un anuncio", href: "/vender" },
    { icon: "📦", label: "Mis anuncios", href: null },
    { icon: "❤️", label: "Favoritos", href: null },
    { icon: "📊", label: "Estadísticas de mis anuncios", href: null },
    { icon: "⚙️", label: "Ajustes", href: null },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-gradient-to-br from-brand-navy to-[#243b8f] px-4 pb-6 pt-6 text-center text-white">
        <div className="mx-auto mb-2.5 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white text-[26px] font-black text-brand-navy">
          {initial}
        </div>
        <div className="flex items-center justify-center gap-2">
          <b className="text-[17px]">{profile.full_name ?? "Mi cuenta"}</b>
          {profile.is_verified && (
            <span className="text-sm text-brand-green" title="Verificado">
              ✔
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[11px] text-[#c3cdf0]">
          Miembro desde {memberSince} · {profile.city}
        </div>
        <div className="mt-3.5 flex justify-center gap-6 text-[11px] text-[#c3cdf0]">
          <div>
            <b className="block text-base text-white">{stats.active}</b>
            Anuncios
          </div>
          <div>
            <b className="block text-base text-white">—</b>
            Valoración
          </div>
          <div>
            <b className="block text-base text-white">{stats.sold}</b>
            Ventas
          </div>
        </div>
      </header>

      <div className="px-4 pb-2 pt-1.5">
        {menuItems.map((item) => {
          const inner = (
            <>
              <span className="w-6 text-center text-[17px]">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-brand-chip px-2 py-0.5 text-[11px] font-semibold text-brand-navy">
                  {item.badge}
                </span>
              )}
              {item.href && <span className="text-[#c3ccdf]">›</span>}
            </>
          );
          return item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 border-b border-brand-line py-3.5 text-[13.5px] text-[#2a3350]"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={item.label}
              className="flex items-center gap-3 border-b border-brand-line py-3.5 text-[13.5px] text-brand-muted"
            >
              {inner}
              <span className="text-[10px] font-semibold text-brand-muted">
                Pronto
              </span>
            </div>
          );
        })}

        <form action={logoutAction}>
          <button className="mt-4 w-full rounded-xl border border-brand-line bg-white py-3 text-sm font-bold text-brand-red">
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
