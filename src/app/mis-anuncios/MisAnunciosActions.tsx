"use client";

import { useTransition } from "react";
import Link from "next/link";
import { setListingStatus, deleteListing } from "@/app/vender/actions";
import type { ListingStatus } from "@/lib/types";

export function MisAnunciosActions({
  id,
  status,
  isFeatured,
}: {
  id: string;
  status: ListingStatus;
  isFeatured: boolean;
}) {
  const [pending, start] = useTransition();

  const btn =
    "rounded-lg border border-brand-line px-2.5 py-1.5 text-[11.5px] font-bold disabled:opacity-50";

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {status === "active" && !isFeatured && (
        <Link href={`/destacar/${id}`} className={`${btn} border-brand-green bg-green-50 text-brand-green-dark`}>
          ⭐ Destacar
        </Link>
      )}
      <Link href={`/vender/${id}`} className={`${btn} text-brand-navy`}>
        Editar
      </Link>
      {status === "active" ? (
        <button
          disabled={pending}
          onClick={() => start(() => setListingStatus(id, "sold"))}
          className={`${btn} text-brand-green-dark`}
        >
          Marcar vendido
        </button>
      ) : (
        <button
          disabled={pending}
          onClick={() => start(() => setListingStatus(id, "active"))}
          className={`${btn} text-brand-green-dark`}
        >
          Reactivar
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("¿Eliminar este anuncio? No se puede deshacer.")) {
            start(() => deleteListing(id));
          }
        }}
        className={`${btn} text-brand-red`}
      >
        Eliminar
      </button>
    </div>
  );
}
