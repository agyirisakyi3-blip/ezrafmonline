import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.AUTH_URL || "https://ezrafmonline.vercel.app";

export default async function newsSitemap() {
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      publishedAt: true,
      title: true,
      category: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 1000,
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${articles
    .map(
      (article) => `
  <url>
    <loc>${SITE_URL}/articles/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Ezrafmonline</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt?.toISOString() || ""}</news:publication_date>
      <news:title>${article.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")}</news:title>
      ${article.category ? `<news:genres>${article.category.name}</news:genres>` : ""}
    </news:news>
  </url>`
    )
    .join("")}
</urlset>`;
}
