import { prisma } from "@/lib/prisma";
import CategoryManager from "./category-manager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1 rounded-full bg-gradient-to-b from-purple-500 to-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Categories</h1>
          <p className="text-sm text-zinc-500">Manage content categories ({categories.length} total)</p>
        </div>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
