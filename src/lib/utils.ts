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
