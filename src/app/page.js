import Image from "next/image";
import ChatWidget from "@/components/ChatWidget";
import { supabase } from "@/lib/supabase";

function formatRupiah(harga) {
  const nilai = Number(harga);
  if (Number.isNaN(nilai)) return "Rp -";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

export default async function Home() {
  const [paketResult, jadwalResult] = await Promise.all([
    supabase.from("paket").select("*").eq("tersedia", true),
    supabase.from("jadwal").select("*").order("tanggal_berangkat", { ascending: true }).limit(5),
  ]);

  const paketList = paketResult.data || [];
  const jadwalList = jadwalResult.data || [];

  const fotoInstagram = [
    "photo-1591604129939-f1efa4d9f7fa",
    "photo-1564769625905-50e93615e769",
    "photo-1513072064285-240f87fa81e8",
    "photo-1578662996442-48f60103fc96",
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* HEADER: Ubah background agar lebih netral atau gunakan salah satu warna logo */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* --- MEMASANG LOGO --- */}
            <div className="flex h-12 w-12 items-center justify-center">
              <Image 
                src="/images/logo-m.png" // Path ke file logo Anda di folder /public
                alt="Logo Tanur Muthmainnah" 
                width={48} 
                height={48} 
                className="object-contain"
              />
            </div>
            {/* ------------------ */}
            <div>
              {/* Gunakan warna Navy/Navy Teal dari logo */}
              <p className="text-sm font-semibold uppercase tracking-widest text-[#1D3557]">Tanur Muthmainnah Tour</p>
              <p className="text-xs text-gray-600">Travel Umrah & Haji Terpercaya</p>
            </div>
          </div>
          {/* Gunakan warna Navy untuk navigasi */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1D3557]">
            {["Beranda", "Paket", "Jadwal", "Video", "Kontak"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-[#147F74]">
                {item}
              </a>
            ))}
          </nav>
          
            {/* Gunakan warna Gold dari logo */}
            <a href="https://wa.me/628123456789"
            className="rounded-full bg-[#C9A84C] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Daftar Sekarang
          </a>
        </div>
      </header>
      {/* HERO */}
      <section className="relative isolate flex min-h-screen items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=2000&q=80"
          alt="Masjidil Haram"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D35]/90 via-[#0A3D35]/60 to-transparent" />
        <div className="absolute right-20 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full border border-[#C9A84C]/20 opacity-50" />
        <div className="absolute right-32 top-1/2 -translate-y-1/2 h-72 w-72 rounded-full border border-[#C9A84C]/30 opacity-50" />
        <div className="absolute right-44 top-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-[#C9A84C]/10" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-24">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
              ✦ Travel Umrah & Haji No. 1 Indonesia
            </p>
            <h1 className="font-serif text-5xl font-bold leading-tight text-white md:text-7xl">
              Perjalanan <span className="text-[#C9A84C]">Suci</span> yang Menenangkan Hati
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Bersama Tanur Muthmainnah Tour — 3 besar pengirim jamaah umrah terbanyak di Indonesia.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              
                <a href="#paket"
                className="rounded-full bg-[#C9A84C] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
              >
                Lihat Paket Umrah
              </a>
              
                <a href="#jadwal"
                className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Cek Jadwal Berangkat
              </a>
            </div>
            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
              {[
                { angka: "6.000+", label: "Jamaah Diberangkatkan" },
                { angka: "99", label: "Perwakilan di Indonesia" },
                { angka: "Top 3", label: "Travel Umrah Nasional" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-[#C9A84C]">{stat.angka}</p>
                  <p className="mt-1 text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FLIGHT DETAIL */}
      <section id="jadwal" className="bg-[#0A3D35] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Jadwal Keberangkatan</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-white md:text-4xl">
                Flight Detail Umrah & Haji
              </h2>
            </div>
            
              <a href="/jadwal"
              className="rounded-full border border-[#C9A84C]/40 px-5 py-2 text-sm text-[#C9A84C] hover:bg-[#C9A84C]/10"
            >
              Lihat Semua
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
                  {["Maskapai", "Rute", "Berangkat", "Pulang", "Hari", "Sisa Seat", "Status"].map((h) => (
                    <th key={h} className="px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {jadwalList.map((item) => (
                  <tr key={item.id} className="text-white/80 transition hover:bg-white/5">
                    <td className="px-5 py-4 font-medium text-white">{item.maskapai}</td>
                    <td className="px-5 py-4">{item.kota_asal} - {item.kota_tujuan}</td>
                    <td className="px-5 py-4 font-mono">{item.tanggal_berangkat} {item.jam_berangkat}</td>
                    <td className="px-5 py-4 font-mono">{item.tanggal_pulang}</td>
                    <td className="px-5 py-4">{item.jumlah_hari} hari</td>
                    <td className="px-5 py-4">
                      <span className={`font-bold ${item.sisa_seat === 0 ? "text-red-400" : item.sisa_seat < 20 ? "text-yellow-400" : "text-green-400"}`}>
                        {item.sisa_seat === 0 ? "FULL" : `${item.sisa_seat} seat`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "open" ? "bg-green-900/50 text-green-300" :
                        item.status === "almost_full" ? "bg-yellow-900/50 text-yellow-300" :
                        "bg-red-900/50 text-red-300"
                      }`}>
                        {item.status === "open" ? "OPEN" : item.status === "almost_full" ? "ALMOST FULL" : "FULL"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!jadwalList.length && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-white/40">
                      Jadwal belum tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PAKET */}
      <section id="paket" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0D7A6B]">Pilihan Paket</p>
            <h2 className="mt-2 font-serif text-4xl font-bold text-[#0A3D35]">
              Paket Umrah & Haji Terbaik
            </h2>
            <p className="mt-4 text-[#4B5A54]">Pilih paket yang sesuai kebutuhan Bapak/Ibu</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {paketList.map((paket, i) => (
              <article
                key={paket.id}
                className={`relative overflow-hidden rounded-3xl border transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  i === 1 ? "border-[#C9A84C] shadow-xl shadow-[#C9A84C]/10" : "border-gray-100"
                }`}
              >
                {i === 1 && (
                  <div className="absolute top-4 right-4 rounded-full bg-[#C9A84C] px-3 py-1 text-xs font-bold text-white">
                    TERPOPULER
                  </div>
                )}
                <div className="bg-gradient-to-br from-[#0A3D35] to-[#0D7A6B] p-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">{paket.jenis}</p>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-white">{paket.nama}</h3>
                  <p className="mt-4 text-4xl font-bold text-[#C9A84C]">{formatRupiah(paket.harga)}</p>
                  <p className="mt-1 text-sm text-white/60">Durasi {paket.durasi}</p>
                </div>
                <div className="bg-white p-8">
                  <ul className="space-y-3">
                    {(Array.isArray(paket.fasilitas) ? paket.fasilitas : [paket.fasilitas]).map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-sm text-[#4B5A54]">
                        <span className="text-[#0D7A6B]">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`mt-8 w-full rounded-full py-3.5 text-sm font-semibold transition hover:brightness-110 ${
                      i === 1 ? "bg-[#C9A84C] text-white" : "bg-[#0A3D35] text-white"
                    }`}
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* YOUTUBE */}
      <section id="video" className="bg-[#F8F9FA] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0D7A6B]">Channel Resmi</p>
            <h2 className="mt-2 font-serif text-4xl font-bold text-[#0A3D35]">
              Video Keberangkatan Jamaah
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <iframe
                className="h-72 w-full"
                src="https://www.youtube.com/embed?listType=user_uploads&list=tanurmuthmainnah_officials"
                title="Tanur Muthmainnah YouTube"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex flex-col justify-center gap-6 rounded-2xl bg-[#0A3D35] p-10 text-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-2xl">
                ▶
              </div>
              <h3 className="font-serif text-2xl font-bold">Subscribe Channel Kami</h3>
              <p className="text-white/70">
                Dapatkan update terbaru keberangkatan jamaah, testimoni, dan panduan ibadah.
              </p>
              
                <a href="https://youtube.com/@tanurmuthmainnah_officials"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
              >
                ▶ Tonton di YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0D7A6B]">Social Media</p>
            <h2 className="mt-2 font-serif text-4xl font-bold text-[#0A3D35]">
              Follow Instagram Kami
            </h2>
            <p className="mt-4 text-[#4B5A54]">@tanurmuthmainnah</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  {fotoInstagram.map((photo) => (
  <a 
    key={photo} // Pindahkan key ke sini
    href="https://instagram.com/tanurmuthmainnah"
    target="_blank"
    rel="noopener noreferrer"
    className="group relative overflow-hidden rounded-2xl"
  >
    <Image
      src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=600&q=80`}
      alt="Instagram Tanur"
      width={600}
      height={600}
      className="h-48 w-full object-cover transition duration-300 group-hover:scale-110"
    />
    <div className="absolute inset-0 flex items-center justify-center bg-[#0A3D35]/0 transition duration-300 group-hover:bg-[#0A3D35]/60">
      <span className="text-2xl opacity-0 transition duration-300 group-hover:opacity-100">📷</span>
    </div>
  </a>
))}
          </div>
          <div className="mt-8 text-center">
            
              <a href="https://instagram.com/tanurmuthmainnah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#0D7A6B] px-8 py-3 text-sm font-semibold text-[#0D7A6B] hover:bg-[#0D7A6B] hover:text-white transition"
            >
              📷 Follow @tanurmuthmainnah
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A3D35] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A84C] text-xl">🕌</div>
                <p className="font-bold text-[#C9A84C]">Tanur Muthmainnah Tour</p>
              </div>
              <p className="mt-4 text-sm text-white/60 leading-7">
                Travel Umrah & Haji terpercaya. Akreditasi A, Top 3 nasional, 6000+ jamaah diberangkatkan.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#C9A84C]">Navigasi</p>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                {["Beranda", "Paket", "Jadwal", "Video", "Kontak"].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#C9A84C]">Ikuti Kami</p>
              <div className="mt-4 flex gap-4">
                
                  <a href="https://instagram.com/tanurmuthmainnah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg hover:bg-[#C9A84C]"
                >
                  📷
                </a>
                
                  <a href="https://youtube.com/@tanurmuthmainnah_officials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg hover:bg-red-600"
                >
                  ▶
                </a>
              </div>
              <p className="mt-6 text-sm text-white/60">© 2026 Tanur Muthmainnah Tour. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
