import { cache } from "react";
import { prisma } from "./prisma";

export const getActiveAds = cache(async (position: string) => {
  return prisma.ad.findMany({
    where: { active: true, position },
    orderBy: { sortOrder: "asc" },
  });
});

export const getSiteConfig = cache(async () => {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "default" },
  });
  return config ?? null;
});
