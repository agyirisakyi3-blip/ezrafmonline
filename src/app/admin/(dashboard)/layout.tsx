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
    redirect("/admin/login");
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

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
