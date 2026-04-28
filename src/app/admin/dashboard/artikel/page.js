"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminArtikelPage() {
  const [artikelList, setArtikelList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    judul: "",
    slug: "",
    ringkasan: "",
    konten: "",
    kategori: "",
    thumbnail_url: "",
    published: false,
  });

  const fetchArtikel = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("artikel")
      .select("*")
      .order("created_at", { ascending: false });
    setArtikelList(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchArtikel(); }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const generateSlug = (judul) => {
    return judul.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleJudulChange = (e) => {
    const judul = e.target.value;
    setForm({ ...form, judul, slug: generateSlug(judul) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editData) {
      await supabase.from("artikel").update(form).eq("id", editData.id);
    } else {
      await supabase.from("artikel").insert(form);
    }
    setShowForm(false);
    setEditData(null);
    setForm({ judul: "", slug: "", ringkasan: "", konten: "", kategori: "", thumbnail_url: "", published: false });
    fetchArtikel();
  };

  const handleEdit = (item) => {
    setEditData(item);
    setForm(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus artikel ini?")) return;
    await supabase.from("artikel").delete().eq("id", id);
    fetchArtikel();
  };

  return (
    <div className="text-white">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#f7d989]">Kelola Artikel</h2>
        <button
          onClick={() => { setShowForm(true); setEditData(null); }}
          className="rounded-lg bg-[#c9a84c] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Tambah Artikel
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-[#27344b] bg-[#101a2e] p-6">
          <h3 className="mb-4 text-lg font-bold text-[#f7d989]">
            {editData ? "Edit Artikel" : "Tambah Artikel Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm text-[#bca56b]">Judul</label>
              <input
                type="text"
                name="judul"
                value={form.judul}
                onChange={handleJudulChange}
                required
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#bca56b]">Slug (auto-generate)</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-[#bca56b] outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-[#bca56b]">Kategori</label>
                <input
                  type="text"
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#bca56b]">Thumbnail URL</label>
                <input
                  type="text"
                  name="thumbnail_url"
                  value={form.thumbnail_url}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#bca56b]">Ringkasan</label>
              <textarea
                name="ringkasan"
                value={form.ringkasan}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#bca56b]">Konten</label>
              <textarea
                name="konten"
                value={form.konten}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="published"
                id="published"
                checked={form.published}
                onChange={handleChange}
                className="h-4 w-4 accent-[#c9a84c]"
              />
              <label htmlFor="published" className="text-sm text-[#bca56b]">
                Publish artikel ini
              </label>
            </div>

            <div className="flex gap-3 justify-end">
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
                {editData ? "Simpan Perubahan" : "Tambah Artikel"}
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
                {["Judul", "Kategori", "Status", "Tanggal", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27344b]">
              {artikelList.map((item) => (
                <tr key={item.id} className="bg-[#0a0f1e] hover:bg-[#101a2e]">
                  <td className="px-4 py-3 font-medium">{item.judul}</td>
                  <td className="px-4 py-3">{item.kategori}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      item.published ? "bg-green-900 text-green-300" : "bg-gray-800 text-gray-400"
                    }`}>
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#bca56b]">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
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
          {artikelList.length === 0 && (
            <p className="py-8 text-center text-[#bca56b]">Belum ada artikel.</p>
          )}
        </div>
      )}
    </div>
  );
}