// Di bagian paling atas, import Image
import Image from "next/image";

// ... (kode lain) ...

// --- Tempat 1: Header Chat ---
// SEBELUMNYA: <div className="flex h-9 w-9 items-center ...">🕌</div>
// GANTI MENJADI:
<div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/20">
  <Image src="/ali-avatar.png" alt="Ali Avatar" fill className="object-cover" />
</div>


// --- Tempat 2: Di Samping Bubble Chat & Loading ---
// SEBELUMNYA: <div className="mr-2 flex h-7 w-7 ...">🕌</div>
// GANTI MENJADI:
<div className="relative mr-2 h-7 w-7 flex-shrink-0 overflow-hidden rounded-full">
  <Image src="/ali-avatar.png" alt="Ali Avatar" fill className="object-cover" />
</div>


// --- Tempat 3: Tombol Trigger Utama ---
// SEBELUMNYA: {isOpen ? "✕" : "🕌"}
// GANTI MENJADI:
{isOpen ? (
  "✕"
) : (
  <Image src="/ali-avatar.png" alt="Ali Avatar" width={56} height={56} className="object-cover" />
)}
