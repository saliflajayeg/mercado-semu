import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile, getConversations } from "@/lib/queries";
import { formatRelativeTime } from "@/lib/format";
import { Thumbnail } from "@/components/listings/Thumbnail";

export default async function MensajesPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/entrar");

  const conversations = await getConversations(profile.id);

  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-brand-navy px-4 py-4 text-white">
        <h2 className="text-base font-extrabold">Mensajes</h2>
      </header>

      {conversations.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-center">
          <span className="text-4xl">💬</span>
          <p className="text-sm text-brand-muted">
            No tienes conversaciones todavía. Abre un anuncio y toca{" "}
            <b>Chatear</b> para escribir al vendedor.
          </p>
        </div>
      ) : (
        <div>
          {conversations.map((c) => {
            const amBuyer = c.buyer_id === profile.id;
            const other = amBuyer ? c.seller : c.buyer;
            const sorted = [...c.messages].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime(),
            );
            const last = sorted[sorted.length - 1];
            const unread = c.messages.filter(
              (m) => m.sender_id !== profile.id && !m.read_at,
            ).length;
            const initial = (other?.full_name ?? "?").charAt(0).toUpperCase();

            return (
              <Link
                key={c.id}
                href={`/mensajes/${c.id}`}
                className="flex items-center gap-3 border-b border-brand-line px-4 py-3"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  {c.listing ? (
                    <Thumbnail
                      emoji={c.listing.emoji}
                      bgColor={c.listing.bg_color}
                      imageUrl={c.listing.images?.[0]?.url ?? null}
                      alt={c.listing.title}
                      emojiClassName="text-xl"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-navy text-sm font-bold text-white">
                      {initial}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <b className="truncate text-[13.5px]">
                      {other?.full_name ?? "Usuario"}
                    </b>
                    {last && (
                      <span className="shrink-0 text-[10.5px] text-brand-muted">
                        {formatRelativeTime(last.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-brand-muted">
                    {c.listing?.title ?? "Anuncio"}
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-[#43506b]">
                      {last
                        ? `${last.sender_id === profile.id ? "Tú: " : ""}${last.body}`
                        : "Escribe el primer mensaje"}
                    </p>
                    {unread > 0 && (
                      <span className="shrink-0 rounded-full bg-brand-green px-1.5 text-[10px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
