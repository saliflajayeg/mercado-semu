import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryChips({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  const chips = [
    { slug: undefined, name_es: "Todo", icon: "🔥" },
    ...categories,
  ];

  return (
    <div className="flex gap-2 overflow-x-auto px-3.5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {chips.map((chip) => {
        const active = chip.slug === activeSlug || (!chip.slug && !activeSlug);
        return (
          <Link
            key={chip.slug ?? "todo"}
            href={chip.slug ? `/?cat=${chip.slug}` : "/"}
            scroll={false}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12.5px] font-semibold ${
              active
                ? "border-brand-green bg-brand-green text-white"
                : "border-brand-line bg-brand-chip text-[#42506b]"
            }`}
          >
            <span>{chip.icon}</span>
            {chip.name_es}
          </Link>
        );
      })}
    </div>
  );
}
