import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [artikelResult, paketResult, jadwalResult] = await Promise.all([
    supabase.from("artikel").select("id", { count: "exact", head: true }),
    supabase.from("paket").select("id,sisa_seat", { count: "exact" }),
    supabase.from("jadwal").select("id,sisa_seat", { count: "exact" }),
  ]);

  const totalArtikel = artikelResult.count ?? 0;
  const totalPaket = paketResult.count ?? 0;
  const totalJadwal = jadwalResult.count ?? 0;
  const totalSeatTersedia =
    (paketResult.data ?? []).reduce(
      (acc, item) => acc + Number(item.sisa_seat ?? 0),
      0
    ) +
    (jadwalResult.data ?? []).reduce(
      (acc, item) => acc + Number(item.sisa_seat ?? 0),
      0
    );

  const stats = [
    { label: "Total Artikel", value: totalArtikel },
    { label: "Total Paket", value: totalPaket },
    { label: "Total Jadwal", value: totalJadwal },
    { label: "Total Seat Tersedia", value: totalSeatTersedia },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <article
          key={item.label}
          className="rounded-xl border border-[#27344b] bg-[#101a2e] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.24)]"
        >
          <p className="text-sm text-[#bca56b]">{item.label}</p>
          <p className="mt-3 text-3xl font-bold text-[#f7d989]">
            {new Intl.NumberFormat("id-ID").format(item.value)}
          </p>
        </article>
      ))}
    </div>
  );
}
