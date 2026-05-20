import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createUser(formData: FormData) {
  "use server";

  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !["ADMIN", "EDITOR"].includes(role)) {
    throw new Error("All fields are required");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("A user with this email already exists");
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: role as any },
  });

  revalidatePath("/cms/users");
  redirect("/cms/users");
}

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
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Create User</h2>
                <p className="text-xs text-zinc-400">Add a new team member</p>
              </div>
            </div>
            <form action={createUser} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1.5">Name</label>
                <input type="text" id="name" name="name" required placeholder="Full name"
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                <input type="email" id="email" name="email" required placeholder="you@example.com"
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
                <input type="password" id="password" name="password" required minLength={6} placeholder="Min. 6 characters"
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-zinc-700 mb-1.5">Role</label>
                <select id="role" name="role" required
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                >
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <p className="mt-1.5 text-xs text-zinc-400">
                  Editors can write and publish articles. Admins have full access including user management.
                </p>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Account
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
