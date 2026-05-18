import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { jsonResponse } from "@/lib/api-utils";
import { checkRateLimit, parseJsonBody, sanitizePlain } from "@/lib/security";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().max(200).optional(),
  description: z.string().max(1000).optional().default(""),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: "asc" },
  });

  return jsonResponse(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "categories:post";
  if (!checkRateLimit(`categories:${ip}`, 10, 60_000)) {
    return jsonResponse({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = await parseJsonBody<Record<string, unknown>>(req);
  if (parsed.error) return jsonResponse(parsed.error, { status: parsed.error.status });

  const result = categorySchema.safeParse(parsed.data);
  if (!result.success) {
    return jsonResponse(
      { error: "Validation failed", details: result.error.issues },
      { status: 400 },
    );
  }

  const data = result.data;
  const slug = data.slug || generateSlug(data.name);

  const category = await prisma.category.create({
    data: {
      name: sanitizePlain(data.name),
      slug,
      description: data.description ? sanitizePlain(data.description) : "",
    },
  });

  revalidatePath("/");
  return jsonResponse(category, { status: 201 });
}
