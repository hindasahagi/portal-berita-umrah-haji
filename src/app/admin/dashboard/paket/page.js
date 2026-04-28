"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPaketPage() {
  const [paketList, setPaketList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    jenis: "umrah",
    harga: "",
    durasi: "",
    fasilitas: "",
    thumbnail_url: "",
    tersedia: true,
  });

  const fetchPaket = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("paket")
      .select("*")
      .order("created_at", { ascending: false });
    setPaketList(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchPaket(); }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      harga: parseInt(form.harga),
      fasilitas: typeof form.fasilitas === "string"
        ? form.fasilitas.split(",").map((f) => f.trim())
        : form.fasilitas,
    };
    if (editData) {
      await supabase.from("paket").update(payload).eq("id", editData.id);
    } else {
      await supabase.from("paket").insert(payload);
    }
    setShowForm(false);
    setEditData(null);
    setForm({ nama: "", jenis: "umrah", harga: "", durasi: "", fasilitas: "", thumbnail_url: "", tersedia: true });
    fetchPaket();
  };

  const handleEdit = (item) => {
    setEditData(item);
    setForm({
      ...item,
      fasilitas: Array.isArray(item.fasilitas) ? item.fasilitas.join(", ") : item.fasilitas,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus paket ini?")) return;
    await supabase.from("paket").delete().eq("id", id);
    fetchPaket();
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  return (
    <div className="text-white">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#f7d989]">Kelola Paket</h2>
        <button
          onClick={() => { setShowForm(true); setEditData(null); }}
          className="rounded-lg bg-[#c9a84c] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Tambah Paket
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-[#27344b] bg-[#101a2e] p-6">
          <h3 className="mb-4 text-lg font-bold text-[#f7d989]">
            {editData ? "Edit Paket" : "Tambah Paket Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-[#bca56b]">Nama Paket</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#bca56b]">Jenis</label>
              <select
                name="jenis"
                value={form.jenis}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
              >
                <option value="umrah">Umrah</option>
                <option value="haji">Haji</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#bca56b]">Harga (Rp)</label>
              <input
                type="number"
                name="harga"
                value={form.harga}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#bca56b]">Durasi</label>
              <input
                type="text"
                name="durasi"
                value={form.durasi}
                onChange={handleChange}
                placeholder="contoh: 9 Hari"
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-[#bca56b]">
                Fasilitas <span className="text-xs text-gray-500">(pisahkan dengan koma)</span>
              </label>
              <input
                type="text"
                name="fasilitas"
                value={form.fasilitas}
                onChange={handleChange}
                placeholder="Hotel Bintang 4, Tiket PP, Visa Umrah"
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-[#bca56b]">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail_url"
                value={form.thumbnail_url}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="tersedia"
                id="tersedia"
                checked={form.tersedia}
                onChange={handleChange}
                className="h-4 w-4 accent-[#c9a84c]"
              />
              <label htmlFor="tersedia" className="text-sm text-[#bca56b]">
                Paket tersedia
              </label>
            </div>

            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-[#27344b] px-4 py-2 text-sm text-[#bca56b] hover:bg-[#27344b]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#c9a84c] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
              >
                {editData ? "Simpan Perubahan" : "Tambah Paket"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-[#bca56b]">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#27344b]">
          <table className="w-full text-sm">
            <thead className="bg-[#101a2e] text-[#bca56b]">
              <tr>
                {["Nama Paket", "Jenis", "Harga", "Durasi", "Fasilitas", "Status", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27344b]">
              {paketList.map((item) => (
                <tr key={item.id} className="bg-[#0a0f1e] hover:bg-[#101a2e]">
                  <td className="px-4 py-3 font-medium">{item.nama}</td>
                  <td className="px-4 py-3 capitalize">{item.jenis}</td>
                  <td className="px-4 py-3 text-[#f7d989] font-semibold">{formatRupiah(item.harga)}</td>
                  <td className="px-4 py-3">{item.durasi}</td>
                  <td className="px-4 py-3 text-[#bca56b] max-w-xs truncate">
                    {Array.isArray(item.fasilitas) ? item.fasilitas.join(", ") : item.fasilitas}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      item.tersedia ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                    }`}>
                      {item.tersedia ? "Tersedia" : "Habis"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded px-2 py-1 text-xs bg-[#27344b] text-[#f7d989] hover:brightness-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded px-2 py-1 text-xs bg-red-900 text-red-300 hover:brightness-110"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paketList.length === 0 && (
            <p className="py-8 text-center text-[#bca56b]">Belum ada paket.</p>
          )}
        </div>
      )}
    </div>
  );
}