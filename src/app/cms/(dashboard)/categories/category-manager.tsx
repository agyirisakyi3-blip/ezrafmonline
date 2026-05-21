"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { articles: number };
}

export default function CategoryManager({
  categories: initial,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      });

      if (!res.ok) throw new Error("Failed to create");

      setName("");
      setDescription("");
      toast("Category created", "success");
      router.refresh();
    } catch {
      toast("Failed to create category", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Add form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sticky top-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900">Add Category</h2>
              <p className="text-xs text-zinc-400">Create a new content category</p>
            </div>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Technology"
                required
                className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm shadow-xs focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-colors placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this category..."
                rows={3}
                className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm shadow-xs focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-colors placeholder:text-zinc-400 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:from-violet-700 hover:to-violet-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Category"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* List */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900 text-sm">Existing Categories</h2>
                <p className="text-xs text-zinc-400">{categories.length} categories</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-zinc-100">
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-6 py-4.5 hover:bg-zinc-50/80 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs font-mono text-zinc-300 w-6 h-6 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">{(i + 1)}</span>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-violet-600 uppercase">{cat.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900 text-sm">{cat.name}</p>
                    <p className="text-xs text-zinc-400">
                      /{cat.slug} {cat.description && <span>&middot; {cat.description}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    {cat._count.articles}
                  </span>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="px-6 py-16 text-center">
                <svg className="mx-auto h-12 w-12 text-zinc-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                <p className="text-zinc-400 text-sm">No categories yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
