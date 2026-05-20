import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SubmissionsList from "./submissions-list";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/cms/login");

  const { status: statusFilter, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const perPage = 20;

  const where = statusFilter && ["pending", "approved", "rejected"].includes(statusFilter)
    ? { status: statusFilter }
    : {};

  const [submissions, total, counts] = await Promise.all([
    prisma.citizenSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.citizenSubmission.count({ where }),
    Promise.all([
      prisma.citizenSubmission.count({ where: { status: "pending" } }),
      prisma.citizenSubmission.count({ where: { status: "approved" } }),
      prisma.citizenSubmission.count({ where: { status: "rejected" } }),
    ]),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const [pendingCount, approvedCount, rejectedCount] = counts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Submissions</h1>
          <p className="text-sm text-zinc-500 mt-1">Citizen story submissions</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusChip href="/cms/submissions" active={!statusFilter} label={`All (${total})`} />
        <StatusChip
          href="/cms/submissions?status=pending"
          active={statusFilter === "pending"}
          label={`Pending (${pendingCount})`}
          color="amber"
        />
        <StatusChip
          href="/cms/submissions?status=approved"
          active={statusFilter === "approved"}
          label={`Approved (${approvedCount})`}
          color="emerald"
        />
        <StatusChip
          href="/cms/submissions?status=rejected"
          active={statusFilter === "rejected"}
          label={`Rejected (${rejectedCount})`}
          color="red"
        />
      </div>

      <SubmissionsList
        submissions={submissions.map((s) => ({
          id: s.id,
          authorName: s.authorName,
          email: s.email,
          phone: s.phone,
          title: s.title,
          content: s.content,
          category: s.category,
          status: s.status,
          createdAt: s.createdAt.toISOString(),
        }))}
        currentPage={currentPage}
        totalPages={totalPages}
        statusFilter={statusFilter || null}
      />
    </div>
  );
}

function StatusChip({
  href,
  active,
  label,
  color = "zinc",
}: {
  href: string;
  active: boolean;
  label: string;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    zinc: active ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50",
    amber: active ? "bg-amber-500 text-white border-amber-500" : "bg-white text-amber-600 border-amber-200 hover:bg-amber-50",
    emerald: active ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50",
    red: active ? "bg-red-500 text-white border-red-500" : "bg-white text-red-600 border-red-200 hover:bg-red-50",
  };

  return (
    <a
      href={href}
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${colorMap[color] || colorMap.zinc}`}
    >
      {label}
    </a>
  );
}
