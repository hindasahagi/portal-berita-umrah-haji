"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function combineDateTime(tanggal, jam) {
  if (!tanggal) return null;
  const jamFinal = jam || "00:00:00";
  return `${tanggal}T${jamFinal}`;
}

function formatDay(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date);
}

function formatClock(date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function getStatus(sisaSeat, pax) {
  if (sisaSeat <= 0) return "FULL";
  if (pax > 0 && sisaSeat / pax <= 0.2) return "ALMOST FULL";
  return "OPEN";
}

function statusStyle(status) {
  if (status === "FULL") {
    return "bg-red-600/20 text-red-300 border border-red-500/40";
  }
  if (status === "ALMOST FULL") {
    return "bg-amber-400/20 text-amber-200 border border-amber-300/40 animate-pulse";
  }
  return "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40";
}

function progressColor(percent) {
  if (percent <= 0) return "bg-red-500";
  if (percent <= 20) return "bg-red-400";
  if (percent <= 45) return "bg-amber-400";
  return "bg-emerald-400";
}

function airlineBadge(maskapai) {
  const nama = (maskapai || "").toLowerCase();
  if (nama.includes("saudia")) return "bg-emerald-700/30 text-emerald-200";
  if (nama.includes("garuda")) return "bg-sky-700/30 text-sky-200";
  if (nama.includes("lion")) return "bg-red-700/30 text-red-200";
  return "bg-zinc-700/40 text-zinc-200";
}

function FlipText({ value, className = "" }) {
  const text = String(value ?? "-");
  return (
    <span className={`inline-flex items-center gap-[2px] ${className}`}>
      {text.split("").map((char, index) => (
        <span
          key={`${text}-${index}`}
          className="flip-char"
          style={{ animationDelay: `${index * 28}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function JadwalPage() {
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [mode, setMode] = useState("dark");
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;

    const fetchJadwal = async () => {
      const { data, error } = await supabase
        .from("jadwal")
        .select("*")
        .order("tanggal_berangkat", { ascending: true })
        .order("jam_berangkat", { ascending: true });

      if (!active) return;

      if (error) {
        setErrorMessage(error.message);
        setJadwal([]);
      } else {
        setErrorMessage("");
        setJadwal(data ?? []);
      }
      setLoading(false);
    };

    fetchJadwal();
    const intervalId = setInterval(fetchJadwal, 30000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  const filteredJadwal = useMemo(() => {
    if (jenisFilter === "Semua") return jadwal;
    return jadwal.filter((item) => (item.jenis || "").toLowerCase() === jenisFilter.toLowerCase());
  }, [jadwal, jenisFilter]);

  const isDark = mode === "dark";

  return (
    <main
      className={`min-h-screen px-4 py-8 md:px-8 ${
        isDark
          ? "bg-[radial-gradient(circle_at_top,_#f6f0df_0%,_#efe6cf_45%,_#e7dcc1_100%)] text-amber-200"
          : "bg-[radial-gradient(circle_at_top,_#f8f5ee_0%,_#efe8db_50%,_#e7dcc8_100%)] text-[#4A3C1F]"
      }`}
    >
      <section
        className={`board-shell mx-auto w-full max-w-7xl rounded-2xl border p-4 shadow-2xl md:p-6 ${
          isDark
            ? "border-[#3B3323] bg-[#1D1A14]"
            : "border-[#d4c2a0] bg-[#fff9ee]"
        }`}
      >
        <div
          className={`mb-6 flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between ${
            isDark ? "border-[#3B3323]" : "border-[#e8d8b6]"
          }`}
        >
          <div>
            <p className={`font-mono text-xs tracking-[0.28em] ${isDark ? "text-[#C9A84C]/80" : "text-[#9e7f33]"}`}>
              DEPARTURE BOARD
            </p>
            <h1 className={`mt-2 text-2xl font-bold tracking-wide md:text-3xl ${isDark ? "text-[#E8C869]" : "text-[#7d6426]"}`}>
              JADWAL KEBERANGKATAN UMRAH & HAJI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode((prev) => (prev === "dark" ? "light" : "dark"))}
              className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                isDark
                  ? "border-[#5A4D35] bg-[#2A241A] text-[#E8C869] hover:bg-[#342B1F]"
                  : "border-[#d4c2a0] bg-[#f3ead7] text-[#7d6426] hover:bg-[#ebdec3]"
              }`}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
            <span className={`rounded-md border px-3 py-2 font-mono text-xs tracking-wide ${isDark ? "border-[#5A4D35] bg-[#2A241A] text-[#DDBB63]" : "border-[#d4c2a0] bg-[#f3ead7] text-[#8b6f2c]"}`}>
              WIB
            </span>
            <span className={`rounded-md border px-4 py-2 font-mono text-lg tracking-widest ${isDark ? "border-[#5A4D35] bg-[#2A241A] text-[#F1D37A]" : "border-[#d4c2a0] bg-[#f3ead7] text-[#7d6426]"}`}>
              <FlipText value={formatClock(clock)} />
            </span>
          </div>
        </div>

        <div
          className={`sticky top-2 z-10 mb-5 flex flex-wrap items-center gap-2 rounded-xl border p-3 backdrop-blur ${
            isDark
              ? "border-[#3B3323] bg-[#1D1A14]/85"
              : "border-[#e8d8b6] bg-[#fff9ee]/90"
          }`}
        >
          {["Semua", "Umrah", "Haji"].map((jenis) => (
            <button
              key={jenis}
              type="button"
              onClick={() => setJenisFilter(jenis)}
              className={`rounded-md border px-4 py-2 text-xs font-semibold tracking-wide transition ${
                jenisFilter === jenis
                  ? "border-[#E8C869] bg-[#C9A84C] text-[#1D1A14]"
                  : isDark
                    ? "border-[#5A4D35] bg-[#2A241A] text-[#E8C869] hover:bg-[#342B1F]"
                    : "border-[#d4c2a0] bg-[#f3ead7] text-[#7d6426] hover:bg-[#ebdec3]"
              }`}
            >
              {jenis}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-200">
            Gagal mengambil data jadwal: {errorMessage}
          </div>
        )}

        <div className={`hidden overflow-x-auto rounded-xl border md:block ${isDark ? "border-[#3B3323]" : "border-[#d4c2a0]"}`}>
          <table className="min-w-[1200px] w-full border-collapse">
            <thead className={isDark ? "bg-[#2A241A]" : "bg-[#f3ead7]"}>
              <tr className={`text-left font-mono text-xs uppercase tracking-wider ${isDark ? "text-[#E8C869]" : "text-[#7d6426]"}`}>
                <th className="px-4 py-3">Maskapai</th>
                <th className="px-4 py-3">No. Penerbangan</th>
                <th className="px-4 py-3">Asal - Tujuan</th>
                <th className="px-4 py-3">Berangkat</th>
                <th className="px-4 py-3">Pulang</th>
                <th className="px-4 py-3">Hari</th>
                <th className="px-4 py-3">PAX</th>
                <th className="px-4 py-3">Sisa Seat</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Keterangan</th>
              </tr>
            </thead>
            <tbody key={`desktop-${jenisFilter}`} className="filter-fade-in">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center font-mono text-sm text-[#C9A84C]">
                    Memuat jadwal keberangkatan...
                  </td>
                </tr>
              ) : filteredJadwal.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center font-mono text-sm text-[#C9A84C]">
                    Tidak ada jadwal untuk filter ini.
                  </td>
                </tr>
              ) : (
                filteredJadwal.map((item, index) => {
                  const pax = Number(item.pax ?? 0);
                  const sisaSeat = Math.max(0, Number(item.sisa_seat ?? 0));
                  const status = getStatus(sisaSeat, pax);
                  const percentSeat = pax > 0 ? Math.round((sisaSeat / pax) * 100) : 0;

                  return (
                    <tr
                      key={item.id}
                      className={`board-row border-t text-sm transition ${
                        isDark
                          ? "border-[#312A1D] bg-[#1D1A14] text-[#F5D67C] hover:bg-[#252017]"
                          : "border-[#eadfc8] bg-[#fffdf8] text-[#6d5721] hover:bg-[#f9f2e3]"
                      }`}
                      style={{
                        animation: `slideIn 480ms ease ${index * 40}ms both`,
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${airlineBadge(item.maskapai)}`}>
                            {item.jenis || "Trip"}
                          </span>
                          <span className={`font-medium ${isDark ? "text-[#F1D37A]" : "text-[#6e5822]"}`}>{item.maskapai || "-"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <FlipText value={item.nomor_penerbangan || "-"} />
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {(item.asal || "-").toUpperCase()} {"->"} {(item.tujuan || "-").toUpperCase()}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <FlipText
                          value={formatDateTime(
                            combineDateTime(item.tanggal_berangkat, item.jam_berangkat)
                          )}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <FlipText
                          value={formatDateTime(
                            combineDateTime(item.tanggal_pulang, item.jam_pulang)
                          )}
                        />
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {formatDay(item.tanggal_berangkat)}
                      </td>
                      <td className="px-4 py-3 font-mono">{pax}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span>{sisaSeat}</span>
                            <span>{percentSeat}%</span>
                          </div>
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-[#3A3224]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${progressColor(percentSeat)}`}
                              style={{ width: `${percentSeat}%` }}
                            />
                          </div>
                          {sisaSeat === 0 && (
                            <span className="inline-block rounded bg-red-600/30 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-200">
                              SOLD OUT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${statusStyle(status)}`}>
                          <FlipText value={status} className="font-mono" />
                        </span>
                      </td>
                      <td className={`px-4 py-3 ${isDark ? "text-[#E5C980]" : "text-[#7a6734]"}`}>{item.keterangan || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div key={`mobile-${jenisFilter}`} className="filter-fade-in space-y-4 md:hidden">
          {loading ? (
            <div className="rounded-xl border border-[#3B3323] bg-[#221D14] p-4 font-mono text-sm text-[#C9A84C]">
              Memuat jadwal keberangkatan...
            </div>
          ) : filteredJadwal.length === 0 ? (
            <div className="rounded-xl border border-[#3B3323] bg-[#221D14] p-4 font-mono text-sm text-[#C9A84C]">
              Tidak ada jadwal untuk filter ini.
            </div>
          ) : (
            filteredJadwal.map((item, index) => {
              const pax = Number(item.pax ?? 0);
              const sisaSeat = Math.max(0, Number(item.sisa_seat ?? 0));
              const status = getStatus(sisaSeat, pax);
              const percentSeat = pax > 0 ? Math.round((sisaSeat / pax) * 100) : 0;
              return (
                <article
                  key={`mobile-${item.id}`}
                  className={`board-card rounded-xl border p-4 ${
                    isDark
                      ? "border-[#3B3323] bg-[#221D14]"
                      : "border-[#d4c2a0] bg-[#fffdf8]"
                  }`}
                  style={{ animation: `slideIn 420ms ease ${index * 40}ms both` }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${airlineBadge(item.maskapai)}`}>
                      {item.jenis || "Trip"}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${statusStyle(status)}`}>
                      <FlipText value={status} className="font-mono" />
                    </span>
                  </div>
                  <h3 className={`text-base font-semibold ${isDark ? "text-[#F1D37A]" : "text-[#6e5822]"}`}>{item.maskapai || "-"}</h3>
                  <p className={`mt-1 font-mono text-xs ${isDark ? "text-[#EBD18C]" : "text-[#8a7239]"}`}>
                    <FlipText value={item.nomor_penerbangan || "-"} />
                  </p>
                  <p className={`mt-3 font-mono text-sm ${isDark ? "text-[#F5D67C]" : "text-[#6b5625]"}`}>
                    {(item.asal || "-").toUpperCase()} {"->"} {(item.tujuan || "-").toUpperCase()}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[#BDAA76]">Berangkat</p>
                      <p className="font-mono text-[#F0CF79]">
                        {formatDateTime(
                          combineDateTime(item.tanggal_berangkat, item.jam_berangkat)
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#BDAA76]">Pulang</p>
                      <p className="font-mono text-[#F0CF79]">
                        {formatDateTime(
                          combineDateTime(item.tanggal_pulang, item.jam_pulang)
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#BDAA76]">Hari</p>
                      <p className="capitalize text-[#F0CF79]">
                        {formatDay(item.tanggal_berangkat)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#BDAA76]">PAX</p>
                      <p className="font-mono text-[#F0CF79]">{pax}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between font-mono text-xs">
                      <span>Sisa Seat: {sisaSeat}</span>
                      <span>{percentSeat}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#3A3224]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColor(percentSeat)}`}
                        style={{ width: `${percentSeat}%` }}
                      />
                    </div>
                    {sisaSeat === 0 && (
                      <span className="mt-2 inline-block rounded bg-red-600/30 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-200">
                        SOLD OUT
                      </span>
                    )}
                  </div>
                  <p className={`mt-3 text-xs ${isDark ? "text-[#D4BC84]" : "text-[#7a6734]"}`}>{item.keterangan || "-"}</p>
                </article>
              );
            })
          )}
        </div>
      </section>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes flipIn {
          0% {
            opacity: 0;
            transform: perspective(200px) rotateX(-75deg) translateY(-3px);
          }
          100% {
            opacity: 1;
            transform: perspective(200px) rotateX(0deg) translateY(0);
          }
        }

        .flip-char {
          display: inline-block;
          min-width: 0.5ch;
          animation: flipIn 360ms ease both;
          transform-origin: 50% 0%;
        }

        .board-shell {
          backdrop-filter: blur(5px);
          box-shadow:
            0 20px 40px rgba(28, 24, 17, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .board-row:hover {
          box-shadow: inset 3px 0 0 #c9a84c;
        }

        .board-card {
          box-shadow:
            0 10px 18px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .filter-fade-in {
          animation: fadeSwap 280ms ease both;
        }

        @keyframes fadeSwap {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
