import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CmsShell from "@/components/cms-shell";

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
    <CmsShell
      user={{
        name: user.name ?? "User",
        role: user.role ?? "EDITOR",
        initial: user.name?.charAt(0)?.toUpperCase() ?? "U",
      }}
      signOutUrl="/api/auth/signout"
    >
      {children}
    </CmsShell>
  );
}
