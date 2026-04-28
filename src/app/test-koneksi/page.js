import { supabase } from "@/lib/supabase";

async function cekKoneksiSupabase() {
  try {
    const { error } = await supabase.auth.getUser("dummy-token");

    if (!error) {
      return true;
    }

    // 4xx menandakan request berhasil mencapai Supabase (token dummy memang invalid).
    if (typeof error.status === "number" && error.status >= 400 && error.status < 500) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export default async function TestKoneksiPage() {
  const isConnected = await cekKoneksiSupabase();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDF8F0] px-6">
      <div className="rounded-2xl border border-[#E6D9BE] bg-white px-8 py-10 text-center shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-[#2B3A32]">
          {isConnected ? "Koneksi Supabase Berhasil!" : "Koneksi Gagal"}
        </h1>
      </div>
    </main>
  );
}
