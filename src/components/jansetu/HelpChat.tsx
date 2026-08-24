import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import logoUrl from "@/assets/jansetu-logo.png";
import { nanoid } from "nanoid";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const SUGGESTIONS = [
  "How do I file a complaint?",
  "How is the Priority Score calculated?",
  "मैं अपनी शिकायत कैसे ट्रैक करूँ?",
];

type ChatItem = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

/** Floating citizen helpdesk chatbot, mounted app-wide. */
export function HelpChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [busy, setBusy] = useState(false);

  const ask = async (text: string) => {
    const query = text.trim();
    if (!query || busy) return;

    const userItem: ChatItem = { id: nanoid(), role: "user", content: query };
    const nextMessages = [...messages, userItem];
    setMessages(nextMessages);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = (await res.json()) as { reply?: string };
      const reply = data.reply || "Namaste! How can I assist you with JanSetu today?";
      setMessages((prev) => [...prev, { id: nanoid(), role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          role: "assistant",
          content:
            "Namaste! I am Setu Sahayak. To file a civic complaint, please visit /report. To track a case, visit /track.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ask JanSetu helpdesk"
          className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full border border-border-strong bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
        >
          <MessageCircle className="size-4" strokeWidth={2.5} />
          Ask JanSetu
        </button>
      )}

      {open && (
        <div className="fixed inset-x-3 bottom-3 z-50 flex h-[70vh] max-h-[560px] flex-col overflow-hidden rounded-xl border border-border-strong bg-background shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px]">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="" className="jansetu-logo h-7 w-auto" />
              <div>
                <p className="text-sm font-semibold leading-tight">Setu Sahayak</p>
                <p className="label-mono">citizen helpdesk</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close helpdesk"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <Conversation className="flex-1">
            <ConversationContent className="gap-3 px-3 py-3">
              {messages.length === 0 && (
                <div className="space-y-3 px-1 py-2">
                  <p className="text-sm text-muted-foreground">
                    Namaste! Ask me anything about filing a report, tracking a case, or how JanSetu
                    turns complaints into civic action.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void ask(s)}
                        className="rounded-lg border border-border px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-accent hover:bg-accent/10"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.role === "assistant" ? (
                      <MessageResponse>{message.content}</MessageResponse>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </MessageContent>
                </Message>
              ))}

              {busy && <Shimmer className="px-1 text-sm">Thinking...</Shimmer>}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border p-3">
            <PromptInput
              onSubmit={(message) => {
                void ask(message.text ?? "");
              }}
            >
              <PromptInputTextarea placeholder="Ask about reports, tracking, priority score..." />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={busy ? "submitted" : "ready"} disabled={busy} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>
  );
}

