import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin-sidebar";
import ThemeToggle from "@/components/cms-theme-toggle";

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
    <div className="cms min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
      <AdminSidebar
        user={{
          name: user.name ?? "User",
          role: user.role ?? "EDITOR",
          initial: user.name?.charAt(0)?.toUpperCase() ?? "U",
        }}
        signOutUrl="/api/auth/signout"
      />

        <div className="flex-1 flex flex-col min-h-screen bg-[var(--color-cms-bg)]">
        {/* Minimal top header bar */}
        <header className="h-16 bg-[var(--color-cms-header-bg)] backdrop-blur-md border-b border-[var(--color-cms-border)] flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <p className="text-xs text-[var(--color-cms-text-muted)] font-medium">CMS / Dashboard</p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="/"
              className="h-8 px-3 rounded-lg text-xs font-medium text-[var(--color-cms-text-secondary)] hover:text-[var(--color-cms-text)] hover:bg-[var(--color-cms-surface-hover)] transition-all flex items-center gap-1.5"
              target="_blank"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View Site
            </a>
            <div className="h-5 w-px bg-[var(--color-cms-border)] mx-1" />
            <div className="flex items-center gap-2 pl-1">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <span className="text-xs font-medium text-[var(--color-cms-text-secondary)]">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
