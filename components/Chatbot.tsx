"use client";

import { useState, useRef, useEffect } from "react";

interface Action {
  tool: string;
  input: unknown;
  result: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  actions?: Action[];
}

interface ChatbotProps {
  onClose: () => void;
}

const QUICK_PROMPTS = [
  "Check my order status",
  "Request a refund",
  "Ask about pricing",
];

function ActionLog({ entries }: { entries: Action[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="mt-2 space-y-1">
      {entries.map((entry, i) => {
        const resultStr = entry.result.slice(0, 80) + (entry.result.length > 80 ? "…" : "");
        return (
          <div
            key={i}
            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500 font-mono"
          >
            <span className="mr-1">⚙️</span>
            <span className="font-semibold text-gray-700">
              Action: {entry.tool}
            </span>
            {"  "}
            <span>{resultStr}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your SneakerHub AI support agent. How can I help you today?",
      actions: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userId: "guest" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          actions: data.actions ?? [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${String(err)}`,
          actions: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-[400px] h-full bg-white shadow-2xl flex flex-col pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
          <span className="font-semibold text-sm">🤖 AI Customer Support</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[85%]">
                <div
                  className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gray-900 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "assistant" && msg.actions && (
                  <ActionLog entries={msg.actions} />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 text-sm text-gray-400">
                <span className="animate-pulse">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 py-2 flex gap-2 flex-wrap border-t border-gray-100">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              disabled={loading}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-3 py-1 transition-colors disabled:opacity-40"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type a message…"
            disabled={loading}
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500 disabled:opacity-40"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
