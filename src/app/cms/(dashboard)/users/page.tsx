import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateUserForm } from "./create-user-form";

export default async function AdminUsersPage() {
  const session = await auth();
  const currentUser = session?.user as { role?: string } | undefined;
  const isAdmin = currentUser?.role === "ADMIN";

  if (!isAdmin) {
    redirect("/cms");
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage writers and editors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      User
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Role
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-50/80 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-900">{u.name}</p>
                            <p className="text-xs text-zinc-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-medium ${
                            u.role === "ADMIN"
                              ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                            u.role === "ADMIN" ? "bg-primary" : "bg-zinc-400"
                          }`} />
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {u.createdAt.toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <p className="px-5 py-12 text-center text-sm text-zinc-400">
                No users found.
              </p>
            )}
          </div>
        </div>

        <div>
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
}
