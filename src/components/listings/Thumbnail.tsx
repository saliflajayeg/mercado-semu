/* eslint-disable @next/next/no-img-element */

export function Thumbnail({
  emoji,
  bgColor,
  imageUrl,
  alt,
  className = "",
  emojiClassName = "text-5xl",
}: {
  emoji: string | null;
  bgColor: string | null;
  imageUrl?: string | null;
  alt: string;
  className?: string;
  emojiClassName?: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ backgroundColor: bgColor ?? "#eef2f7" }}
    >
      <span className={emojiClassName}>{emoji ?? "🛍️"}</span>
    </div>
  );
}
