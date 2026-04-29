"use client";

import { useState, useRef, useEffect } from "react";

// --- KOMPONEN AVATAR SVG (Karakter Muslim Peci) ---
// Kita buat komponen terpisah agar kode utama tidak kotor.
// Pastikan komponen ini memiliki nama yang unik (misal: MuslimAiAvatar).
const MuslimAiAvatar = ({ className = "h-9 w-9" }) => (
  <svg 
    viewBox="0 0 128 128" 
    className={`${className} rounded-full object-cover border-2 border-white/20`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background Lingkaran Teal yang menyatu dengan tema */}
    <circle cx="64" cy="64" r="64" fill="#0D7A6B"/>
    
    {/* Peci (Kopiah) berwarna gelap */}
    <path d="M40 35C40 29.4772 44.4772 25 50 25H78C83.5228 25 88 29.4772 88 35V45H40V35Z" fill="#1A2821"/>
    
    {/* Wajah */}
    <path d="M92 70C92 85.464 79.464 98 64 98C48.536 98 36 85.464 36 70V45H92V70Z" fill="#FDDAC1"/>
    
    {/* Mata */}
    <circle cx="52" cy="60" r="4" fill="#1A2821"/>
    <circle cx="76" cy="60" r="4" fill="#1A2821"/>
    
    {/* Senyum Ramah */}
    <path d="M54 78C54 78 58 83 64 83C70 83 74 78 74 78" stroke="#1A2821" strokeWidth="3" strokeLinecap="round"/>
    
    {/* Baju Koko berwarna putih */}
    <path d="M26 110C26 102.268 32.268 96 40 96H88C95.732 96 102 102.268 102 110V128H26V110Z" fill="white"/>
  </svg>
);
// --------------------------------------------------

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Assalamu'alaikum! Saya Ali, asisten AI Tanur Muthmainnah Tour. Ada yang bisa saya bantu seputar umrah dan haji? 😊",
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
        { role: "assistant", content: "Mohon maaf, Ali sedang gangguan koneksi. Silakan coba lagi sebentar lagi ya." },
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
              {/* --- PERUBAHAN 1: LOGO HEADER --- */}
              {/* Gunakan komponen avatar SVG karakter Muslim */}
              <MuslimAiAvatar className="h-10 w-10 border-2 border-white/20" />
              {/* ------------------------------- */}
              <div>
                <p className="text-sm font-bold text-white">Ali - Tanur AI</p>
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
                  /* --- PERUBAHAN 2: AVATAR DI BUBBLE --- */
                  /* Gunakan avatar SVG kecil di samping pesan AI */
                  <MuslimAiAvatar className="mr-2 h-7 w-7 flex-shrink-0" />
                  /* ------------------------------------- */
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#0D7A6B] text-white rounded-br-sm"
                    : "bg-white text-[#1A2821] shadow-sm border border-gray-100 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* LOADING STATE */}
            {isLoading && (
              <div className="flex justify-start">
                {/* --- PERUBAHAN 3: AVATAR DI LOADING --- */}
                <MuslimAiAvatar className="mr-2 h-7 w-7 flex-shrink-0" />
                {/* --------------------------------------- */}
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

          {/* QUICK SUGGESTIONS & INPUT AREA (Tetap Sama) */}
          <div className="border-t border-gray-100 bg-white px-3 py-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
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
          </div>

          <div className="border-t border-gray-100 bg-white p-3">
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
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D7A6B] text-white disabled:opacity-50 hover:brightness-110"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOMBOL DRIGGER CHAT */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0D7A6B] text-2xl shadow-lg hover:brightness-110 transition overflow-hidden p-0 border-4 border-white"
      >
        {/* --- PERUBAHAN 4: LOGO TOMBOL UTAMA --- */}
        {isOpen ? (
          <span className="text-white text-3xl">✕</span>
        ) : (
          /* Tampilkan avatar Muslim penuh di tombol utama */
          <MuslimAiAvatar className="h-full w-full" />
        )}
        {/* -------------------------------------- */}
      </button>
    </div>
  );
}
