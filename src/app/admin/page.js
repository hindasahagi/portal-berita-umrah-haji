"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const forbiddenMessage =
    searchParams.get("error") === "forbidden"
      ? "Akses ditolak. Akun Anda belum memiliki role admin (role: \"admin\") di user_metadata atau app_metadata Supabase. Hubungi super admin untuk aktivasi akses."
      : "";

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message || "Login gagal. Periksa email dan password.");
      setIsLoading(false);
      return;
    }

    window.location.href = "/admin/dashboard";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fdf8f0_0%,_#f4ebd9_55%,_#ead7b0_100%)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#d8ba74] bg-white/90 p-8 shadow-[0_20px_60px_rgba(85,62,22,0.2)] backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9f7d35]">
            Admin Access
          </p>
          <h1 className="mt-3 text-2xl font-bold text-[#5e4520]">
            Portal Umrah & Haji - Admin
          </h1>
          <p className="mt-2 text-sm text-[#8f7340]">
            Masuk untuk mengelola konten dan jadwal keberangkatan.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#6f5426]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-[#dfc995] bg-[#fffaf0] px-4 py-2.5 text-sm text-[#4e3915] outline-none transition focus:border-[#c9a84c] focus:ring-2 focus:ring-[#e8d190]"
              placeholder="hindasah.agi@gmail.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#6f5426]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-[#dfc995] bg-[#fffaf0] px-4 py-2.5 text-sm text-[#4e3915] outline-none transition focus:border-[#c9a84c] focus:ring-2 focus:ring-[#e8d190]"
              placeholder="@Agi891106"
            />
          </div>

          {(errorMessage || forbiddenMessage) && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage || forbiddenMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#c9a84c] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
