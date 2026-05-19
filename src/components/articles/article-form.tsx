"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";

const Editor = dynamic(() => import("@/components/ui/editor"), { ssr: false });

interface Category {
  id: string;
  name: string;
}

export default function ArticleForm({
  categories,
  article,
}: {
  categories: Category[];
  article?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    status: string;
    isEditorPick: boolean;
    seoTitle: string;
    seoDescription: string;
    categoryId: string;
  };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [featuredImage, setFeaturedImage] = useState(
    article?.featuredImage ?? ""
  );
  const [status, setStatus] = useState(article?.status ?? "draft");
  const [categoryId, setCategoryId] = useState(article?.categoryId ?? "");
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    article?.seoDescription ?? ""
  );
  const [isEditorPick, setIsEditorPick] = useState(
    article?.isEditorPick ?? false
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!article) setSlug(generateSlug(value));
  };

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_SIZE = 5 * 1024 * 1024;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
      return;
    }
    if (file.size > MAX_SIZE) {
      alert("File too large. Maximum size is 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      setFeaturedImage(data.url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      status,
      isEditorPick,
      categoryId: categoryId || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
    };

    const url = article
      ? `/api/admin/articles/${article.id}`
      : "/api/admin/articles";
    const method = article ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      router.push("/cms/articles");
      router.refresh();
    } catch {
      alert("Failed to save article");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Article Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter a compelling headline..."
                required
                className="block w-full rounded-lg border border-zinc-300 px-4 py-3 text-base shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Slug
              </label>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="shrink-0">/articles/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="block flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of the article..."
                rows={3}
                className="block w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Content
              </label>
              <Editor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
            <h3 className="font-semibold text-sm text-zinc-700 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Publish Settings
            </h3>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">
                Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    status === "draft"
                      ? "bg-amber-100 text-amber-800 ring-2 ring-amber-300"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    status === "published"
                      ? "bg-green-100 text-green-800 ring-2 ring-green-300"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}
                >
                  Published
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isEditorPick}
                  onChange={(e) => setIsEditorPick(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`block w-9 h-5 rounded-full transition-colors ${
                    isEditorPick ? "bg-primary" : "bg-zinc-300"
                  }`}
                />
                <div
                  className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow-xs ${
                    isEditorPick ? "translate-x-4" : ""
                  }`}
                />
              </div>
              <div>
                <span className="text-sm font-medium text-zinc-700">Editor&apos;s Pick</span>
                <p className="text-xs text-zinc-400">Feature this article in the editors&apos; picks section</p>
              </div>
            </label>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
            <h3 className="font-semibold text-sm text-zinc-700 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Featured Image
            </h3>
            <div className="relative">
              {featuredImage ? (
                <div className="relative rounded-lg overflow-hidden bg-zinc-100">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage("")}
                    className="absolute top-2 right-2 bg-white/90 rounded-full p-1 text-zinc-600 hover:text-primary transition-colors shadow-xs"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 cursor-pointer hover:border-primary hover:bg-primary-light/50 transition-colors">
                  <svg className="h-8 w-8 text-zinc-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-zinc-500">
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                Or paste image URL
              </label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
            <h3 className="font-semibold text-sm text-zinc-700 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              SEO Settings
            </h3>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO-optimized title..."
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                Meta Description
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Brief description for search results..."
                rows={3}
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          Cancel
        </button>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : status === "published" ? (
              "Publish Article"
            ) : (
              "Save as Draft"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
