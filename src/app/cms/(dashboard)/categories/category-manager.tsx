"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      router.refresh();
    } catch {
      alert("Failed to create category");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Add form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 sticky top-8">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-6 w-6 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="font-semibold text-zinc-900">Add Category</h2>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Technology"
                required
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm shadow-xs focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this category..."
                rows={3}
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm shadow-xs focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors placeholder:text-zinc-400"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2.5 text-sm font-semibold text-white hover:shadow-md hover:from-purple-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 bg-gradient-to-r from-white to-zinc-50/50">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
                className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/80 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs font-mono text-zinc-300 w-5 shrink-0">{(i + 1).toString().padStart(2, "0")}</span>
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-purple-600 uppercase">{cat.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900 text-sm">{cat.name}</p>
                    <p className="text-xs text-zinc-400">
                      /{cat.slug} {cat.description && <span>&middot; {cat.description}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    {cat._count.articles}
                  </span>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="px-6 py-16 text-center">
                <svg className="mx-auto h-10 w-10 text-zinc-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
