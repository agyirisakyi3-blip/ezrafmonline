import { cache } from "react";
import { prisma } from "./prisma";
import type { Prisma } from "@/generated/prisma/client";

const articleInclude = {
  category: true,
  author: { select: { name: true } },
} satisfies Prisma.ArticleInclude;

const articleSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featuredImage: true,
  publishedAt: true,
  category: { select: { name: true, slug: true } },
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

export const getPublishedArticles = cache(async (take?: number) => {
  return prisma.article.findMany({
    where: { status: "published" },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    ...(take ? { take } : {}),
  });
});

export const getArticlesByCategory = cache(async (slug: string) => {
  return prisma.article.findMany({
    where: { status: "published", category: { slug } },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({ where: { slug } });
});

export const getAllCategories = cache(async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
});

export const getPopularArticles = cache(async (take = 5) => {
  return prisma.article.findMany({
    where: { status: "published" },
    select: articleSelect,
    orderBy: { publishedAt: "desc" },
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
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      featuredImage: true, publishedAt: true, content: true,
      category: { select: { name: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });
  return articles
    .sort((a, b) => b.content.length - a.content.length)
    .slice(0, take)
    .map(({ content, ...rest }) => rest);
});

export const getRelatedArticles = cache(async (categoryId: string, excludeId: string, take = 5) => {
  return prisma.article.findMany({
    where: { status: "published", categoryId, id: { not: excludeId } },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take,
  });
});

export const getLatestArticles = cache(async (excludeId: string, take = 5) => {
  return prisma.article.findMany({
    where: { status: "published", id: { not: excludeId } },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take,
  });
});

export const getHomepageData = cache(async () => {
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 30,
    include: { category: true, author: { select: { name: true } } },
  });
  const deeplyRead = await getDeeplyRead(5);
  const editorPicks = await getEditorPicks(6);
  return { articles, deeplyRead, editorPicks };
});
