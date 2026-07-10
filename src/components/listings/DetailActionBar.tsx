"use client";

import { useRouter } from "next/navigation";
import { FavoriteButton } from "./FavoriteButton";

export function DetailActionBar({
  whatsappUrl,
  listingId,
  initialFavorited,
  isLoggedIn,
}: {
  whatsappUrl: string;
  listingId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();

  return (
    <div className="fixed inset-x-0 bottom-16 z-20 mx-auto flex w-full max-w-md gap-2.5 border-t border-brand-line bg-white px-3.5 py-2.5">
      <FavoriteButton
        listingId={listingId}
        initialFavorited={initialFavorited}
        isLoggedIn={isLoggedIn}
        size="lg"
      />
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
  );
}
