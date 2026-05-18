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

  if (!name || !email || !password || !role) {
    throw new Error("All fields are required");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("A user with this email already exists");
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Users</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage writers and editors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Name
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Role
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            u.role === "ADMIN"
                              ? "bg-primary/10 text-primary"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500">
                        {u.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <p className="px-4 py-12 text-center text-sm text-zinc-400">
                No users found.
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">
              Create User
            </h2>
            <form action={createUser} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minLength={6}
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-zinc-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <p className="mt-1 text-xs text-zinc-400">
                  Editors can write and publish articles. Admins have full access
                  including user management.
                </p>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
