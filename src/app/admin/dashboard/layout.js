import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isAdminUser } from "@/lib/admin-role";

async function handleLogout() {
  "use server";
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin");
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/dashboard/jadwal", label: "Jadwal" },
  { href: "/admin/dashboard/artikel", label: "Artikel" },
  { href: "/admin/dashboard/paket", label: "Paket" },
];

export default async function AdminDashboardLayout({ children }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) {
    redirect("/admin");
  }

  const displayName =
    user.user_metadata?.nama ||
    user.user_metadata?.full_name ||
    user.email ||
    "Admin";

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#f5d27a]">
      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="hidden min-h-screen w-64 border-r border-[#27344b] bg-[#101a2e] p-6 md:block">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a84c]/80">
            Admin Panel
          </p>
          <h2 className="mt-3 text-xl font-bold text-[#f4d386]">
            Portal Umrah & Haji
          </h2>

          <nav className="mt-10 space-y-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="block rounded-lg px-4 py-2 text-[#c4b07c] transition hover:bg-[#17253e] hover:text-[#f5d27a]"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-5 md:p-8">
          <header className="mb-8 flex flex-col gap-3 rounded-xl border border-[#27344b] bg-[#101a2e] px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-bold text-[#f6d791] md:text-2xl">
                Admin Portal Umrah & Haji
              </h1>
              <p className="text-sm text-[#cbb176]">
                Login sebagai: {displayName}
              </p>
            </div>
            <form action={handleLogout}>
              <button
                type="submit"
                className="rounded-lg border border-[#c9a84c] px-4 py-2 text-sm font-semibold text-[#f6d791] transition hover:bg-[#c9a84c] hover:text-[#101a2e]"
              >
                Logout
              </button>
            </form>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
