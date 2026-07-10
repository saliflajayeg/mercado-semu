"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/app/favoritos/actions";

export function FavoriteButton({
  listingId,
  initialFavorited,
  isLoggedIn,
  size = "sm",
}: {
  listingId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
  size?: "sm" | "lg";
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, start] = useTransition();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push("/entrar");
      return;
    }
    const next = !favorited;
    setFavorited(next); // optimistic
    start(async () => {
      const result = await toggleFavorite(listingId);
      if ("error" in result) {
        setFavorited(!next); // revert
        router.push("/entrar");
      } else {
        setFavorited(result.favorited);
      }
    });
  }

  const base =
    size === "lg"
      ? "flex-none rounded-xl bg-brand-chip px-4 py-3.5 text-lg text-brand-navy"
      : "flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[13px]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={favorited ? "Quitar de favoritos" : "Guardar en favoritos"}
      aria-pressed={favorited}
      className={base}
    >
      {favorited ? "❤️" : "🤍"}
    </button>
  );
}
