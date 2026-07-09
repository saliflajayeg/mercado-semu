"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image";
import { formatXAF } from "@/lib/format";
import type { Category } from "@/lib/types";
import { createListing, updateListing, type ListingInput } from "./actions";

const MAX_PHOTOS = 10;

type Initial = {
  id?: string;
  title?: string;
  categoryId?: number | null;
  priceXaf?: number;
  description?: string;
  zone?: string;
  images?: string[];
};

const fieldClass =
  "w-full rounded-xl border border-brand-line bg-white px-3 py-3 text-sm outline-none focus:border-brand-green";

export function VenderForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Initial;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [categoryId, setCategoryId] = useState<string>(
    initial?.categoryId ? String(initial.categoryId) : "",
  );
  const [price, setPrice] = useState<string>(
    initial?.priceXaf ? String(initial.priceXaf) : "",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [zone, setZone] = useState(initial?.zone ?? "");

  const [keptImages, setKeptImages] = useState<string[]>(initial?.images ?? []);
  const [newFiles, setNewFiles] = useState<
    { file: File; preview: string }[]
  >([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const totalPhotos = keptImages.length + newFiles.length;
  const priceNumber = Number(price.replace(/\D/g, ""));

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const room = MAX_PHOTOS - totalPhotos;
    const next = picked.slice(0, room).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewFiles((prev) => [...prev, ...next]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeNew(idx: number) {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function removeKept(url: string) {
    setKeptImages((prev) => prev.filter((u) => u !== url));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Escribe qué vendes.");
    if (!categoryId) return setError("Elige una categoría.");
    if (!priceNumber || priceNumber < 0) return setError("Escribe un precio válido.");
    if (totalPhotos === 0) return setError("Añade al menos una foto.");

    setBusy(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setBusy(false);
        return setError("Inicia sesión para publicar.");
      }

      // Compress + upload each new photo to the user's storage folder.
      const uploadedUrls: string[] = [];
      for (const { file } of newFiles) {
        const blob = await compressImage(file);
        const path = `${user.id}/${crypto.randomUUID()}.webp`;
        const { error: upErr } = await supabase.storage
          .from("listing-images")
          .upload(path, blob, { contentType: "image/webp", upsert: false });
        if (upErr) {
          setBusy(false);
          return setError("No se pudo subir una foto. Revisa tu conexión.");
        }
        const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }

      const input: ListingInput = {
        id: initial?.id,
        title,
        categoryId: Number(categoryId),
        priceXaf: priceNumber,
        description,
        zone,
        imageUrls: [...keptImages, ...uploadedUrls],
      };

      const result = isEdit
        ? await updateListing(input)
        : await createListing(input);

      if ("error" in result) {
        setBusy(false);
        return setError(result.error);
      }
      router.push(`/listing/${result.id}`);
    } catch {
      setBusy(false);
      setError("Algo salió mal. Inténtalo de nuevo.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="px-4 pb-8 pt-4">
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-brand-red">
          {error}
        </div>
      )}

      {/* Photos */}
      <div className="grid grid-cols-3 gap-2">
        {keptImages.map((url) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-xl">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeKept(url)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ))}
        {newFiles.map((f, i) => (
          <div key={f.preview} className="relative aspect-square overflow-hidden rounded-xl">
            <img src={f.preview} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeNew(i)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ))}
        {totalPhotos < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#c3ccdf] text-brand-muted"
          >
            <span className="text-2xl">📷</span>
            <span className="text-[11px]">Añadir</span>
          </button>
        )}
      </div>
      <p className="mt-1.5 text-[11px] text-brand-muted">
        {totalPhotos}/{MAX_PHOTOS} fotos · la primera es la portada
      </p>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onPickFiles}
        className="hidden"
      />

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-bold text-[#39425c]">
          ¿Qué vendes?
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={fieldClass}
          placeholder="Ej: Caja de cervezas Castel x24"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-bold text-[#39425c]">
          Categoría
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={fieldClass}
        >
          <option value="">Elige una categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name_es}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-bold text-[#39425c]">
          Precio (FCFA)
        </label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          className={fieldClass}
          placeholder="Ej: 12000"
        />
        {priceNumber > 0 && (
          <p className="mt-1 text-[11px] text-brand-muted">{formatXAF(priceNumber)}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-bold text-[#39425c]">
          Zona <span className="font-normal text-brand-muted">(opcional)</span>
        </label>
        <input
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className={fieldClass}
          placeholder="Ej: Ela Nguema"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-bold text-[#39425c]">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${fieldClass} h-24 resize-none`}
          placeholder="Describe tu producto, estado, cantidad..."
        />
      </div>

      {!isEdit && (
        <div className="mt-4 rounded-xl border border-[#f4d79a] bg-gradient-to-br from-[#fff7e8] to-[#ffeccf] p-3.5">
          <b className="flex items-center gap-1.5 text-[13.5px] text-[#8a5a10]">
            ⭐ Destaca tu anuncio
          </b>
          <p className="mt-1 text-[11.5px] leading-snug text-[#9a6a20]">
            Aparece arriba en los resultados y en Destacados. Podrás activarlo
            desde Planes de vendedor.
          </p>
          <Link
            href="/planes"
            className="mt-2 inline-block text-[12px] font-bold text-brand-green-dark"
          >
            Ver planes →
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-5 w-full rounded-xl bg-brand-green py-3.5 text-[15px] font-extrabold text-white disabled:opacity-60"
      >
        {busy
          ? "Publicando..."
          : isEdit
            ? "Guardar cambios"
            : "Publicar gratis"}
      </button>
    </form>
  );
}
