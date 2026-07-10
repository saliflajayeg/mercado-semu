"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        router.push(term ? `/buscar?q=${encodeURIComponent(term)}` : "/buscar");
      }}
      className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5"
    >
      <span className="text-brand-muted">🔎</span>
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar en Mercado Semu..."
        className="flex-1 bg-transparent text-[13px] text-brand-ink outline-none"
      />
      {q && (
        <button
          type="button"
          onClick={() => {
            setQ("");
            router.push("/buscar");
          }}
          aria-label="Borrar"
          className="text-brand-muted"
        >
          ✕
        </button>
      )}
    </form>
  );
}
