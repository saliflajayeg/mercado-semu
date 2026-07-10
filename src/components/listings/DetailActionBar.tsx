"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FavoriteButton } from "./FavoriteButton";
import { startConversation } from "@/app/mensajes/actions";

export function DetailActionBar({
  whatsappUrl,
  listingId,
  initialFavorited,
  isLoggedIn,
  isOwner,
}: {
  whatsappUrl: string;
  listingId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  if (isOwner) {
    return (
      <div className="fixed inset-x-0 bottom-16 z-20 mx-auto flex w-full max-w-md gap-2.5 border-t border-brand-line bg-white px-3.5 py-2.5">
        <button
          onClick={() => router.push(`/vender/${listingId}`)}
          className="flex-1 rounded-xl bg-brand-navy py-3.5 text-sm font-extrabold text-white"
        >
          ✏️ Editar anuncio
        </button>
      </div>
    );
  }

  function chatear() {
    if (!isLoggedIn) {
      router.push("/entrar");
      return;
    }
    start(async () => {
      const result = await startConversation(listingId);
      if ("id" in result) router.push(`/mensajes/${result.id}`);
      else if (result.error === "auth") router.push("/entrar");
    });
  }

  return (
    <div className="fixed inset-x-0 bottom-16 z-20 mx-auto flex w-full max-w-md gap-2.5 border-t border-brand-line bg-white px-3.5 py-2.5">
      <FavoriteButton
        listingId={listingId}
        initialFavorited={initialFavorited}
        isLoggedIn={isLoggedIn}
        size="lg"
      />
      <button
        onClick={chatear}
        disabled={pending}
        className="flex-1 rounded-xl bg-brand-navy py-3.5 text-sm font-extrabold text-white disabled:opacity-60"
      >
        {pending ? "Abriendo..." : "💬 Chatear"}
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
