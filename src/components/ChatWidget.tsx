// src/components/ChatWidget.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'What services do you offer?',
  'How much do agents cost?',
  'Can you build a 3D hero for us?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm Omega’s assistant. I can answer quick questions about our services and pricing, or help you book a call.",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  // Avoid super long messages in UI
  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const send = async (text: string) => {
    const user: Msg = { role: 'user', content: text.trim() };
    setMessages((m) => [...m, user]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, user] }),
      });

      if (!res.ok) throw new Error('Network error');

      const data: { reply?: string } = await res.json();
      const bot: Msg = {
        role: 'assistant',
        content:
          data.reply ??
          "Sorry — I couldn't answer right now. Please try again, or book a quick call: https://calendly.com/hello-omegaappbuilder/30min",
      };
      setMessages((m) => [...m, bot]);
    } catch (_) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            'Hmm, something went wrong. You can refresh and try again, or book a quick call: https://calendly.com/hello-omegaappbuilder/30min',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSend) void send(input);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500" />
        <span className="absolute inset-0 rounded-full bg-white/10" />
        <span className="relative flex h-full w-full items-center justify-center text-white">
          {/* chat bubble icon */}
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h8M8 14h5M7 19l3.5-3.5H18a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v4a3 3 0 003 3h1"
            />
          </svg>
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          role="dialog"
          aria-label="Omega chat"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-fuchsia-50 to-indigo-50 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Omega Assistant</div>
              <div className="text-xs text-slate-600">Quick questions about services & pricing</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-slate-500 hover:bg-white/60"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="max-h-80 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-2xl px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Quick suggestions (first interaction only) */}
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer notice */}
          <div className="px-4 text-[11px] text-slate-500">
            I can share brief info only. For deep dives or quotes, please book a call.
          </div>

          {/* Composer */}
          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-slate-200 p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) void send(input);
                }
              }}
              rows={1}
              placeholder="Ask about services, pricing, booking…"
              className="min-h-[40px] max-h-28 flex-1 resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              aria-label="Send"
            >
              {sending ? '…' : 'Send'}
            </button>
          </form>

          {/* Links row */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2 text-[12px]">
            <a
              className="underline decoration-dotted hover:text-slate-800"
              href="https://omegaappbuilder.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              omegaappbuilder.com
            </a>
            <a
              className="underline decoration-dotted hover:text-slate-800"
              href="https://calendly.com/hello-omegaappbuilder/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book 15-min call
            </a>
          </div>
        </div>
      )}
    </>
  );
}