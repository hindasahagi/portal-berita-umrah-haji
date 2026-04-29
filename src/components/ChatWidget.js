"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Assalamu'alaikum! Saya Aisyah, asisten AI Tanur Muthmainnah Tour. Ada yang bisa saya bantu seputar umrah dan haji? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message || data.error }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Maaf, sedang gangguan koneksi." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-[#0D7A6B]/20 bg-white shadow-2xl">
          {/* HEADER */}
          <div className="flex items-center justify-between bg-[#0D7A6B] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/50 bg-white">
                {/* PAKAI IMG BIASA AGAR PASTI MUNCUL */}
                <img src="/aisyah.png" alt="Aisyah" className="h-full w-full object-cover object-top" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Aisyah - Tanur Assistant</p>
                <p className="text-xs text-white/70">Online • Siap membantu</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">✕</button>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FFFE]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="mr-2 h-8 w-8 overflow-hidden rounded-full bg-white border">
                    <img src="/aisyah.png" alt="AI" className="h-full w-full object-cover object-top" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === "user" ? "bg-[#0D7A6B] text-white" : "bg-white text-gray-800 shadow-sm border"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="border-t p-3 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ketik pertanyaan..."
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-[#0D7A6B]"
              />
              <button onClick={sendMessage} className="bg-[#0D7A6B] text-white p-2 rounded-full w-9 h-9">➤</button>
            </div>
          </div>
        </div>
      )}

      {/* TOMBOL BULAT */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl hover:scale-110 transition-transform"
      >
        {isOpen ? (
          <span className="text-[#0D7A6B] text-2xl font-bold">✕</span>
        ) : (
          <img src="/aisyah.png" alt="Bantuan" className="h-full w-full object-cover object-top" />
        )}
      </button>
    </div>
  );
}
