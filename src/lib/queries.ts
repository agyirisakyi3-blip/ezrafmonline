import { cache } from "react";
import { prisma } from "./prisma";
import type { Prisma } from "@/generated/prisma/client";

const articleInclude = {
  category: true,
  author: { select: { id: true, name: true } },
} satisfies Prisma.ArticleInclude;

const articleSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  publishedAt: true,
  viewCount: true,
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ArticleSelect;

const articleListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  publishedAt: true,
  viewCount: true,
  category: { select: { name: true, slug: true } },
  author: { select: { id: true, name: true } },
} satisfies Prisma.ArticleSelect;


export type CachedArticle = Prisma.ArticleGetPayload<{
  include: typeof articleInclude;
}>;

export const getPublishedArticleBySlug = cache(async (slug: string) => {
  return prisma.article.findUnique({
    where: { slug, status: "published" },
    include: articleInclude,
  });
});

export const getPublishedArticles = cache(async (take = 50) => {
  return prisma.article.findMany({
    where: { status: "published" },
    select: articleListSelect,
    orderBy: { publishedAt: "desc" },
    take,
  });
});

export const getArticlesByCategory = cache(async (slug: string, page = 1, perPage = 50) => {
  return prisma.article.findMany({
    where: { status: "published", category: { slug } },
    select: articleListSelect,
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({ where: { slug } });
});

export const getAllCategories = cache(async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
});

export const getAuthorById = cache(async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      articles: {
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        select: articleListSelect,
      },
    },
  });
});

export const getPopularArticles = cache(async (take = 5) => {
  return prisma.article.findMany({
    where: { status: "published" },
    select: articleSelect,
    orderBy: { viewCount: "desc" },
    take,
  });
});

export const getEditorPicks = cache(async (take = 6) => {
  return prisma.article.findMany({
    where: { status: "published", isEditorPick: true },
    select: articleSelect,
    orderBy: { publishedAt: "desc" },
    take,
  });
});

export const getDeeplyRead = cache(async (take = 5) => {
  const ids = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "Article"
    WHERE status = 'published'
    ORDER BY LENGTH(content) DESC
    LIMIT ${take}
  `;
  if (ids.length === 0) return [];
  const rows = await prisma.article.findMany({
    where: { id: { in: ids.map((r) => r.id) } },
    select: articleSelect,
  });
  const orderMap = new Map(ids.map((r, i) => [r.id, i]));
  return rows.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
});

export const getRelatedArticles = cache(async (categoryId: string, excludeId: string, take = 5) => {
  return prisma.article.findMany({
    where: { status: "published", categoryId, id: { not: excludeId } },
    select: articleListSelect,
    orderBy: { publishedAt: "desc" },
    take,
  });
});

export const getLatestArticles = cache(async (excludeId: string, take = 5) => {
  return prisma.article.findMany({
    where: { status: "published", id: { not: excludeId } },
    select: articleListSelect,
    orderBy: { publishedAt: "desc" },
    take,
  });
});

export const getHomepageData = cache(async () => {
  const [articles, deeplyRead, editorPicks] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 20,
      select: articleListSelect,
    }),
    getDeeplyRead(5),
    getEditorPicks(6),
  ]);
  return { articles, deeplyRead, editorPicks };
});
