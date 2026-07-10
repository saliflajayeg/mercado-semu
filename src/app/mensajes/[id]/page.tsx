import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile, getConversation } from "@/lib/queries";
import { ChatView } from "./ChatView";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getSessionProfile();
  if (!profile) redirect("/entrar");

  const conversation = await getConversation(id);
  if (
    !conversation ||
    (conversation.buyer_id !== profile.id &&
      conversation.seller_id !== profile.id)
  ) {
    redirect("/mensajes");
  }

  const amBuyer = conversation.buyer_id === profile.id;
  const other = amBuyer ? conversation.seller : conversation.buyer;
  const messages = [...conversation.messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 bg-brand-navy px-4 py-3 text-white">
        <Link href="/mensajes" aria-label="Volver" className="text-xl">
          ←
        </Link>
        <div className="min-w-0 flex-1">
          <b className="block truncate text-sm">
            {other?.full_name ?? "Usuario"}
          </b>
          {conversation.listing && (
            <Link
              href={`/listing/${conversation.listing.id}`}
              className="block truncate text-[11px] text-[#c3cdf0]"
            >
              {conversation.listing.title}
            </Link>
          )}
        </div>
      </header>

      <ChatView
        conversationId={conversation.id}
        myProfileId={profile.id}
        initialMessages={messages}
      />
    </div>
  );
}
