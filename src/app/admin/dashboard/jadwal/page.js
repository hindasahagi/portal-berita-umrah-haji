"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminJadwalPage() {
  const [jadwalList, setJadwalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    maskapai: "",
    kota_asal: "",
    kota_tujuan: "",
    tanggal_berangkat: "",
    jam_berangkat: "",
    tanggal_pulang: "",
    jam_pulang: "",
    jumlah_hari: "",
    pax: "",
    sisa_seat: "",
    nomor_penerbangan: "",
    jenis: "umrah",
    keterangan: "",
    status: "open",
  });

  const fetchJadwal = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("jadwal")
      .select("*")
      .order("tanggal_berangkat", { ascending: true });
    setJadwalList(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editData) {
      await supabase.from("jadwal").update(form).eq("id", editData.id);
    } else {
      await supabase.from("jadwal").insert(form);
    }
    setShowForm(false);
    setEditData(null);
    setForm({
      maskapai: "", kota_asal: "", kota_tujuan: "",
      tanggal_berangkat: "", jam_berangkat: "",
      tanggal_pulang: "", jam_pulang: "",
      jumlah_hari: "", pax: "", sisa_seat: "",
      nomor_penerbangan: "", jenis: "umrah",
      keterangan: "", status: "open",
    });
    fetchJadwal();
  };

  const handleEdit = (item) => {
    setEditData(item);
    setForm(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus jadwal ini?")) return;
    await supabase.from("jadwal").delete().eq("id", id);
    fetchJadwal();
  };

  return (
    <div className="text-white">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#f7d989]">Kelola Jadwal</h2>
        <button
          onClick={() => { setShowForm(true); setEditData(null); }}
          className="rounded-lg bg-[#c9a84c] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Tambah Jadwal
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-[#27344b] bg-[#101a2e] p-6">
          <h3 className="mb-4 text-lg font-bold text-[#f7d989]">
            {editData ? "Edit Jadwal" : "Tambah Jadwal Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {[
              { name: "maskapai", label: "Maskapai" },
              { name: "nomor_penerbangan", label: "No. Penerbangan" },
              { name: "kota_asal", label: "Kota Asal" },
              { name: "kota_tujuan", label: "Kota Tujuan" },
              { name: "tanggal_berangkat", label: "Tgl Berangkat", type: "date" },
              { name: "jam_berangkat", label: "Jam Berangkat", type: "time" },
              { name: "tanggal_pulang", label: "Tgl Pulang", type: "date" },
              { name: "jam_pulang", label: "Jam Pulang", type: "time" },
              { name: "jumlah_hari", label: "Jumlah Hari", type: "number" },
              { name: "pax", label: "Total PAX", type: "number" },
              { name: "sisa_seat", label: "Sisa Seat", type: "number" },
              { name: "keterangan", label: "Keterangan" },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-1 block text-sm text-[#bca56b]">{field.label}</label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
                />
              </div>
            ))}

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
              <label className="mb-1 block text-sm text-[#bca56b]">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#27344b] bg-[#0a0f1e] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
              >
                <option value="open">Open</option>
                <option value="almost_full">Almost Full</option>
                <option value="full">Full</option>
              </select>
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
                {editData ? "Simpan Perubahan" : "Tambah Jadwal"}
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
                {["Maskapai", "No. Penerbangan", "Rute", "Berangkat", "Pulang", "Hari", "PAX", "Sisa", "Status", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27344b]">
              {jadwalList.map((item) => (
                <tr key={item.id} className="bg-[#0a0f1e] hover:bg-[#101a2e]">
                  <td className="px-4 py-3">{item.maskapai}</td>
                  <td className="px-4 py-3">{item.nomor_penerbangan}</td>
                  <td className="px-4 py-3">{item.kota_asal} → {item.kota_tujuan}</td>
                  <td className="px-4 py-3">{item.tanggal_berangkat} {item.jam_berangkat}</td>
                  <td className="px-4 py-3">{item.tanggal_pulang} {item.jam_pulang}</td>
                  <td className="px-4 py-3">{item.jumlah_hari}</td>
                  <td className="px-4 py-3">{item.pax}</td>
                  <td className="px-4 py-3">{item.sisa_seat}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      item.status === "open" ? "bg-green-900 text-green-300" :
                      item.status === "almost_full" ? "bg-yellow-900 text-yellow-300" :
                      "bg-red-900 text-red-300"
                    }`}>
                      {item.status === "open" ? "OPEN" : item.status === "almost_full" ? "ALMOST FULL" : "FULL"}
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
          {jadwalList.length === 0 && (
            <p className="py-8 text-center text-[#bca56b]">Belum ada jadwal.</p>
          )}
        </div>
      )}
    </div>
  );
}