import ChatWidget from "@/components/ChatWidget";
import Image from "next/image";
import { BookOpenText, Newspaper, ShieldCheck, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

const fallbackArtikel = [
  {
    judul: "5 Persiapan Penting Sebelum Berangkat Umrah",
    ringkasan:
      "Panduan ringkas mengenai dokumen, kesehatan, dan perlengkapan agar ibadah lebih tenang.",
    gambar:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
  },
  {
    judul: "Memahami Rukun Haji untuk Jamaah Pemula",
    ringkasan:
      "Kenali urutan rukun haji beserta tips praktis agar Anda menjalani setiap tahap dengan baik.",
    gambar:
      "https://images.unsplash.com/photo-1513072064285-240f87fa81e8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    judul: "Tips Menjaga Stamina Selama di Tanah Suci",
    ringkasan:
      "Strategi sederhana menjaga kebugaran fisik selama umrah dan haji, dari pola makan hingga istirahat.",
    gambar:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
  },
];

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
  const [artikelResult, paketResult, jadwalResult] = await Promise.all([
    supabase
      .from("artikel")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("paket")
      .select("id,nama,jenis,harga,durasi,fasilitas,thumbnail_url,tersedia")
      .eq("tersedia", true),
    supabase
      .from("jadwal")
      .select(
        "id,maskapai,asal,tujuan,tanggal_berangkat,jam_berangkat,sisa_seat"
      )
      .order("tanggal_berangkat", { ascending: true })
      .order("jam_berangkat", { ascending: true })
      .limit(5),
  ]);

  const artikelTerbaru =
    artikelResult.error || !artikelResult.data?.length
      ? fallbackArtikel
      : artikelResult.data.map((item) => ({
          judul: item.judul ?? item.title ?? "Artikel Umrah & Haji",
          ringkasan: item.ringkasan ?? item.deskripsi ?? item.konten_singkat ?? "-",
          gambar:
            item.thumbnail ??
            item.thumbnail_url ??
            item.gambar ??
            "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
        }));

  const paketUmrahHaji =
    paketResult.error || !paketResult.data?.length
      ? []
      : paketResult.data.map((item) => ({
          id: item.id,
          nama: item.nama ?? "Paket Umrah",
          jenis: item.jenis ?? "-",
          harga: formatRupiah(item.harga),
          durasi: item.durasi ?? "-",
          fasilitas:
            item.fasilitas ??
            "Fasilitas paket tersedia sesuai detail program.",
          thumbnailUrl:
            item.thumbnail_url ??
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
        }));

  const paketErrorMessage = paketResult.error
    ? `${paketResult.error.message} (code: ${paketResult.error.code ?? "-"})`
    : null;
  const jadwalBerangkat = (jadwalResult.data ?? []).map((item) => ({
    id: item.id,
    maskapai: item.maskapai ?? "-",
    rute: `${(item.asal ?? "-").toUpperCase()} -> ${(item.tujuan ?? "-").toUpperCase()}`,
    waktu: `${item.tanggal_berangkat ?? "-"} ${item.jam_berangkat ?? ""}`.trim(),
    sisaSeat: Number(item.sisa_seat ?? 0),
  }));

  const daftarMaskapai = Array.from(
    new Set((jadwalResult.data ?? []).map((item) => item.maskapai).filter(Boolean))
  );

  const flyerTerbaru = [
    ...paketUmrahHaji.map((item) => ({
      title: item.nama,
      image: item.thumbnailUrl,
    })),
    ...artikelTerbaru.map((item) => ({
      title: item.judul,
      image: item.gambar,
    })),
  ].slice(0, 6);

  const keunggulan = [
    {
      ikon: ShieldCheck,
      judul: "Terpercaya",
      deskripsi: "Informasi diverifikasi dan disusun oleh tim berpengalaman.",
    },
    {
      ikon: Newspaper,
      judul: "Info Terkini",
      deskripsi: "Update terbaru seputar kebijakan, visa, dan jadwal keberangkatan.",
    },
    {
      ikon: BookOpenText,
      judul: "Panduan Lengkap",
      deskripsi: "Materi persiapan ibadah dari awal hingga kepulangan.",
    },
    {
      ikon: Users,
      judul: "Komunitas Jamaah",
      deskripsi: "Ruang berbagi pengalaman dan dukungan antarjamaah.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#0A3D35]">
      <header className="sticky top-0 z-20 border-b border-[#E6D9BE] bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <a className="text-xl font-bold tracking-tight text-[#0D7A6B]" href="#">
            PORTAL - TANUR MUTHMAINNAH TOUR
          </a>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm font-medium text-[#0D7A6B]">
              <li>
                <a className="transition hover:text-[#C9A84C]" href="#">
                  Beranda
                </a>
              </li>
              <li>
                <a className="transition hover:text-[#C9A84C]" href="#paket">
                  Paket
                </a>
              </li>
              <li>
                <a className="transition hover:text-[#C9A84C]" href="#artikel">
                  Artikel
                </a>
              </li>
              <li>
                <a className="transition hover:text-[#C9A84C]" href="#jadwal">
                  Jadwal
                </a>
              </li>
              <li>
                <a className="transition hover:text-[#C9A84C]" href="#panduan">
                  Panduan
                </a>
              </li>
              <li>
                <a className="transition hover:text-[#C9A84C]" href="#tentang">
                  Tentang Kami
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <details className="border-t border-[#E6D9BE] md:hidden">
          <summary className="cursor-pointer list-none px-6 py-3 text-sm font-semibold text-[#0D7A6B]">
            Menu
          </summary>
          <nav className="bg-white px-6 pb-4">
            <ul className="space-y-3 text-sm font-medium text-[#0D7A6B]">
              <li>
                <a className="block rounded-md px-2 py-1 transition hover:bg-[#E8F4FD] hover:text-[#C9A84C]" href="#">
                  Beranda
                </a>
              </li>
              <li>
                <a className="block rounded-md px-2 py-1 transition hover:bg-[#E8F4FD] hover:text-[#C9A84C]" href="#paket">
                  Paket
                </a>
              </li>
              <li>
                <a className="block rounded-md px-2 py-1 transition hover:bg-[#E8F4FD] hover:text-[#C9A84C]" href="#artikel">
                  Artikel
                </a>
              </li>
              <li>
                <a className="block rounded-md px-2 py-1 transition hover:bg-[#E8F4FD] hover:text-[#C9A84C]" href="#jadwal">
                  Jadwal
                </a>
              </li>
              <li>
                <a className="block rounded-md px-2 py-1 transition hover:bg-[#E8F4FD] hover:text-[#C9A84C]" href="#panduan">
                  Panduan
                </a>
              </li>
              <li>
                <a className="block rounded-md px-2 py-1 transition hover:bg-[#E8F4FD] hover:text-[#C9A84C]" href="#tentang">
                  Tentang Kami
                </a>
              </li>
            </ul>
          </nav>
        </details>
      </header>

      <main>
        <section className="relative isolate overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=2000&q=80"
            alt="Masjidil Haram"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#1C2A24]/60" />
          <div className="relative mx-auto w-full max-w-6xl px-6 py-28 md:py-36">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex rounded-full bg-[#E8F4FD]/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0D7A6B]">
                Informasi Ibadah
              </p>
              <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
                Wawasan Umrah dan Haji yang Menenangkan Hati
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#F8F8F0] md:text-xl">
                Temukan berita terkini, panduan lengkap, dan rekomendasi terbaik
                untuk perjalanan ibadah yang aman, nyaman, dan penuh makna.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#paket"
                  className="rounded-full bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Lihat Paket Umrah
                </a>
                <a
                  href="#panduan"
                  className="rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Baca Panduan
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="paket" className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0D7A6B]">
              Paket Umrah & Haji
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#0A3D35] md:text-4xl">
              Pilihan Paket Sesuai Kebutuhan Jamaah
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {paketUmrahHaji.map((paket) => (
              <article
                key={paket.id ?? paket.nama}
                className="rounded-2xl border border-[#E6D9BE] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Image
                  src={paket.thumbnailUrl}
                  alt={paket.nama}
                  width={1200}
                  height={800}
                  className="mb-5 h-44 w-full rounded-xl object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <h3 className="font-serif text-2xl font-bold text-[#0D7A6B]">
                  {paket.nama}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#0D7A6B]">
                  {paket.jenis}
                </p>
                <p className="mt-4 text-3xl font-bold text-[#C9A84C]">{paket.harga}</p>
                <p className="mt-2 text-sm font-medium text-[#0D7A6B]">
                  Durasi: {paket.durasi}
                </p>
                <p className="mt-4 min-h-20 text-sm leading-7 text-[#4B5A54]">
                  {paket.fasilitas}
                </p>
                <button
                  type="button"
                  className="mt-6 w-full rounded-full bg-[#0D7A6B] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Pesan Sekarang
                </button>
              </article>
            ))}
          </div>
          {paketErrorMessage && (
            <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Gagal memuat data paket dari Supabase: {paketErrorMessage}
            </p>
          )}
          {!paketUmrahHaji.length && (
            <p className="text-sm text-[#4B5A54]">
              Belum ada paket yang tersedia saat ini.
            </p>
          )}
        </section>

        <section
          id="artikel"
          className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 pb-20 pt-4"
        >
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold text-[#0A3D35]">
              Artikel Terbaru
            </h2>
            <a
              className="text-sm font-semibold text-[#0D7A6B] hover:text-[#C9A84C]"
              href="#artikel"
            >
              Lihat Semua
            </a>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {artikelTerbaru.map((artikel) => (
              <article
                key={artikel.judul}
                className="overflow-hidden rounded-2xl border border-[#E6D9BE] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Image
                  src={artikel.gambar}
                  alt={artikel.judul}
                  width={1200}
                  height={800}
                  className="h-52 w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0D7A6B]">
                    Artikel
                  </p>
                  <h3 className="mt-3 font-serif text-xl font-bold leading-8 text-[#0A3D35]">
                    {artikel.judul}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#4B5A54]">
                    {artikel.ringkasan}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="panduan" className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 pb-20">
          <div className="rounded-2xl border border-[#E6D9BE] bg-[#E8F4FD] p-10">
            <h2 className="font-serif text-3xl font-bold text-[#0A3D35]">
              Panduan Singkat
            </h2>
            <p className="mt-4 max-w-3xl text-[#4B5A54]">
              Dapatkan panduan dasar mulai dari persiapan dokumen, jadwal manasik,
              hingga tips menjaga kesehatan selama perjalanan ibadah.
            </p>
          </div>
        </section>

        <section id="jadwal" className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 pb-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0D7A6B]">
                Jadwal Terdekat
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[#0A3D35]">
                Keberangkatan Umrah & Haji
              </h2>
            </div>
            <a href="/jadwal" className="text-sm font-semibold text-[#0D7A6B] hover:text-[#C9A84C]">
              Lihat Semua
            </a>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#E6D9BE] bg-white">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-[#F7F0DE] text-left text-[#5E4A1D]">
                <tr>
                  <th className="px-4 py-3">Maskapai</th>
                  <th className="px-4 py-3">Rute</th>
                  <th className="px-4 py-3">Berangkat</th>
                  <th className="px-4 py-3">Sisa Seat</th>
                </tr>
              </thead>
              <tbody>
                {jadwalBerangkat.map((row) => (
                  <tr key={row.id} className="border-t border-[#EFE3C9]">
                    <td className="px-4 py-3 font-medium text-[#0A3D35]">{row.maskapai}</td>
                    <td className="px-4 py-3 text-[#4B5A54]">{row.rute}</td>
                    <td className="px-4 py-3 text-[#4B5A54]">{row.waktu}</td>
                    <td className="px-4 py-3 font-semibold text-[#0D7A6B]">{row.sisaSeat}</td>
                  </tr>
                ))}
                {!jadwalBerangkat.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-[#4B5A54]">
                      Jadwal belum tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="grid gap-8 md:grid-cols-2">
            <article className="rounded-2xl border border-[#E6D9BE] bg-white p-7">
              <h3 className="font-serif text-2xl font-bold text-[#0A3D35]">
                Daftar Maskapai Rekanan
              </h3>
              <div className="mt-5 flex flex-wrap gap-3">
                {daftarMaskapai.map((maskapai) => (
                  <span
                    key={maskapai}
                    className="rounded-full bg-[#E8F4FD] px-4 py-2 text-sm font-semibold text-[#356175]"
                  >
                    {maskapai}
                  </span>
                ))}
                {!daftarMaskapai.length && (
                  <p className="text-sm text-[#4B5A54]">Belum ada data maskapai.</p>
                )}
              </div>
            </article>

            <article className="rounded-2xl border border-[#E6D9BE] bg-white p-7">
              <h3 className="font-serif text-2xl font-bold text-[#0A3D35]">
                Video Umrah Haji Terbaru
              </h3>
              <div className="mt-5 overflow-hidden rounded-xl border border-[#E6D9BE]">
                <iframe
                  className="h-64 w-full"
                  src="https://www.youtube.com/embed/oquA0V2U9Ag"
                  title="Video Umrah Haji"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </article>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="mb-6">
            <h3 className="font-serif text-3xl font-bold text-[#0A3D35]">
              Flyer Umrah Haji Terbaru
            </h3>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {flyerTerbaru.map((flyer) => (
              <article
                key={`${flyer.title}-${flyer.image}`}
                className="overflow-hidden rounded-2xl border border-[#E6D9BE] bg-white"
              >
                <Image
                  src={flyer.image}
                  alt={flyer.title}
                  width={1200}
                  height={900}
                  className="h-48 w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <p className="px-4 py-3 text-sm font-semibold text-[#0A3D35]">
                  {flyer.title}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0D7A6B]">
              Mengapa Pilih Kami
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#0A3D35] md:text-4xl">
              Komitmen Kami untuk Jamaah Indonesia
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {keunggulan.map((item) => {
              const Icon = item.ikon;
              return (
              <article
                key={item.judul}
                className="rounded-2xl border border-[#E6D9BE] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F4FD] text-[#0D7A6B]">
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A3D35]">
                  {item.judul}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#4B5A54]">
                  {item.deskripsi}
                </p>
              </article>
              );
            })}
          </div>
        </section>

        <section id="tentang" className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 pb-24">
          <div className="rounded-2xl bg-[#0D7A6B] p-10 text-white">
            <h2 className="font-serif text-3xl font-bold">Tentang Kami</h2>
            <p className="mt-4 max-w-3xl text-[#E7F0EA]">
              Portal ini hadir untuk menyediakan informasi tepercaya seputar umrah
              dan haji, agar jamaah Indonesia bisa beribadah dengan persiapan yang
              matang dan tenang.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E6D9BE] bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-6 py-5 text-sm text-[#4b6358] sm:flex-row sm:items-center">
          <p>© 2026 Portal Umrah & Haji</p>
          <p>Semua hak cipta dilindungi.</p>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}
