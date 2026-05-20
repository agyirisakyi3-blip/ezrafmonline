"use client";

import { useState } from "react";
import Link from "next/link";

type Submission = {
  id: string;
  authorName: string;
  email: string | null;
  phone: string | null;
  title: string;
  content: string;
  category: string;
  status: string;
  createdAt: string;
};

export default function SubmissionsList({
  submissions,
  currentPage,
  totalPages,
  statusFilter,
}: {
  submissions: Submission[];
  currentPage: number;
  totalPages: number;
  statusFilter: string | null;
}) {
  const [items, setItems] = useState(submissions);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      }
    } finally {
      setUpdating(null);
    }
  }

  function buildPageUrl(page: number) {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/cms/submissions${qs ? `?${qs}` : ""}`;
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200/70 p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="text-zinc-500 text-sm">No submissions found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-zinc-200/70 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-zinc-900 text-sm line-clamp-1">{s.title}</h3>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-xs text-zinc-500">
                  by <span className="font-medium text-zinc-700">{s.authorName}</span> &middot;{" "}
                  {s.category} &middot;{" "}
                  {new Date(s.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>

              {s.status === "pending" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateStatus(s.id, "approved")}
                    disabled={updating === s.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 border border-emerald-200 transition-all disabled:opacity-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(s.id, "rejected")}
                    disabled={updating === s.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                </div>
              )}

              {(s.status === "approved" || s.status === "rejected") && (
                <button
                  onClick={() => updateStatus(s.id, "pending")}
                  disabled={updating === s.id}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-50 text-zinc-600 text-xs font-semibold hover:bg-zinc-100 border border-zinc-200 transition-all disabled:opacity-50"
                >
                  Reset
                </button>
              )}
            </div>

            <p className="text-sm text-zinc-600 line-clamp-3 whitespace-pre-wrap">{s.content}</p>

            {(s.email || s.phone) && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-100 text-xs text-zinc-400">
                {s.email && (
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {s.email}
                  </span>
                )}
                {s.phone && (
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {s.phone}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {currentPage > 1 && (
            <Link
              href={buildPageUrl(currentPage - 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 transition-all"
            >
              Previous
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildPageUrl(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                p === currentPage
                  ? "bg-primary text-white"
                  : "text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {p}
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link
              href={buildPageUrl(currentPage + 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 transition-all"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}
