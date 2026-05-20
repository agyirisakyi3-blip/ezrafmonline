"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/articles/${slug}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data?.comments ?? []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/articles/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), authorName: authorName.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Failed to post comment");
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-zinc-900 border-l-4 border-primary pl-3 mb-6">
        Comments ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            required
            className="block w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            required
            className="block w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !content.trim() || !authorName.trim()}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 w-24 bg-zinc-200 rounded" />
              <div className="h-3 w-20 bg-zinc-100 rounded" />
              <div className="h-12 bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-zinc-400 text-sm py-8 text-center">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="pb-6 border-b border-zinc-100 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{comment.authorName}</p>
                  <p className="text-xs text-zinc-400">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
