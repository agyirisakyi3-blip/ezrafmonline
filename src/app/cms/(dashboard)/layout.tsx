import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/cms/login");
  }

  const user = session.user as { name?: string; role?: string; id?: string };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <AdminSidebar
        user={{
          name: user.name ?? "User",
          role: user.role ?? "EDITOR",
          initial: user.name?.charAt(0)?.toUpperCase() ?? "U",
        }}
        signOutUrl="/api/auth/signout"
      />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header bar */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                className="w-72 pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-zinc-600 placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="h-9 w-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-all relative">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[9px] font-bold text-white flex items-center justify-center shadow-sm shadow-accent/50">3</span>
            </button>

            <div className="h-6 w-px bg-zinc-200" />

            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <span className="text-sm font-medium text-zinc-700 hidden sm:block">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
