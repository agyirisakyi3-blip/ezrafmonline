import { prisma } from "@/lib/prisma";
import CategoryManager from "./category-manager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Categories</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage content categories</p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
