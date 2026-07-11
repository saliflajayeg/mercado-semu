import { ListSkeleton } from "@/components/ui/Skeleton";

export default function MensajesLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-brand-navy px-4 py-4 text-white">
        <h2 className="text-base font-extrabold">Mensajes</h2>
      </header>
      <ListSkeleton />
    </div>
  );
}
