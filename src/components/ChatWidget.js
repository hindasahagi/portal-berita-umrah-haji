"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image"; // Import Image dari Next.js

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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message || data.error },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Mohon maaf, koneksi sedang terputus. Silakan coba sesaat lagi ya." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-[#0D7A6B]/20 bg-white shadow-2xl">
          {/* HEADER CHAT */}
          <div className="flex items-center justify-between bg-[#0D7A6B] px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Foto Profil di Header */}
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/20 bg-white">
                <Image 
                  src="/cs-muslimah.png" 
                  alt="Aisyah Avatar" 
                  fill 
                  className="object-cover object-top"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Aisyah - Tanur Assistant</p>
                <p className="text-xs text-white/70">Online • Siap membantu</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white text-xl">
              ✕
            </button>
          </div>

          {/* AREA PESAN */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FFFE]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="relative mr-2 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-white border border-gray-100">
                    <Image 
                      src="/cs-muslimah.png" 
                      alt="Aisyah" 
                      fill 
                      className="object-cover object-top"
                    />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#0D7A6B] text-white rounded-br-sm"
                    : "bg-white text-[#2B3A32] shadow-sm border border-gray-100 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="relative mr-2 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-white">
                  <Image src="/cs-muslimah.png" alt="Aisyah" fill className="object-cover object-top" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#0D7A6B]" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#0D7A6B]" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#0D7A6B]" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="border-t border-gray-100 bg-white p-3">
             {/* Tombol Saran Cepat */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-1">
              {["Syarat dokumen?", "Biaya umrah?", "Jadwal berangkat?"].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="flex-shrink-0 rounded-full border border-[#0D7A6B]/30 px-3 py-1 text-xs text-[#0D7A6B] hover:bg-[#0D7A6B]/10 whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pertanyaan..."
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-[#0D7A6B]"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D7A6B] text-white disabled:opacity-50 hover:brightness-110 transition"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOMBOL TRIGGER UTAMA */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 overflow-hidden border-2 ${
          isOpen ? "bg-white border-[#0D7A6B]" : "bg-[#0D7A6B] border-white"
        }`}
      >
        {isOpen ? (
          <span className="text-[#0D7A6B] text-2xl font-bold">✕</span>
        ) : (
          <div className="relative h-full w-full bg-white">
             <Image 
                src="/cs-muslimah.png" 
                alt="Bantuan Aisyah" 
                fill 
                className="object-cover object-top p-1" // P1 agar gambar tidak terlalu mentok ke pinggir lingkaran
              />
          </div>
        )}
      </button>
    </div>
  );
}
