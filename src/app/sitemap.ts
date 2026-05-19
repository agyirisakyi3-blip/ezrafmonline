import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.AUTH_URL || "https://ezrafmonline.com";

export default async function sitemap() {
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true, publishedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const authors = await prisma.user.findMany({
    select: { id: true, updatedAt: true },
    where: { articles: { some: { status: "published" } } },
  });

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...authors.map((author) => ({
      url: `${SITE_URL}/authors/${author.id}`,
      lastModified: author.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];
}
