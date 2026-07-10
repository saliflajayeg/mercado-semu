"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
  read_at: string | null;
};

export function ChatView({
  conversationId,
  myProfileId,
  initialMessages,
}: {
  conversationId: string;
  myProfileId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [supabase] = useState(() => createClient());
  const bottomRef = useRef<HTMLDivElement>(null);

  function addMessage(m: Message) {
    setMessages((prev) =>
      prev.some((x) => x.id === m.id) ? prev : [...prev, m],
    );
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Mark the other party's unread messages as read.
    supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", myProfileId)
      .is("read_at", null)
      .then(() => {});

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => addMessage(payload.new as Message),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, myProfileId, supabase]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setDraft("");
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: myProfileId,
        body,
      })
      .select()
      .single();
    setSending(false);
    if (error || !data) {
      setDraft(body); // restore on failure
      return;
    }
    addMessage(data as Message);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-xs text-brand-muted">
            Escribe el primer mensaje para empezar la conversación.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === myProfileId;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${
                  mine
                    ? "rounded-br-sm bg-brand-green text-white"
                    : "rounded-bl-sm bg-white text-brand-ink"
                }`}
              >
                {m.body}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={send}
        className="sticky bottom-16 flex items-center gap-2 border-t border-brand-line bg-white px-3 py-2.5"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-full border border-brand-line bg-brand-bg px-4 py-2.5 text-sm outline-none focus:border-brand-green"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-lg text-white disabled:opacity-50"
          aria-label="Enviar"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
