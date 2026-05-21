import { format } from "date-fns";
import slugify from "slugify";

export function generateSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateLong(date: Date | string): string {
  return format(new Date(date), "MMMM d, yyyy");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).replace(/\s+\S*$/, "") + "...";
}

export function getReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function imageUrl(url: string | null | undefined): string {
  if (!url) return "";
  // If it's already an absolute URL (Vercel Blob, external), return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Fix legacy local /uploads/ paths to go through the proxy
  return url.replace(/^\/uploads\//, "/api/uploads/");
}
