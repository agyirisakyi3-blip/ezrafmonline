import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, sanitizePlain } from "@/lib/security";
import { z } from "zod";

const submissionSchema = z.object({
  authorName: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  category: z.string().max(50).optional().default("general"),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "submission:post";
  if (!checkRateLimit(`submission:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const json = await req.json();
    const result = submissionSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.issues },
        { status: 400 },
      );
    }

    const { authorName, email, phone, title, content, category } = result.data;

    await prisma.citizenSubmission.create({
      data: {
        authorName: sanitizePlain(authorName.trim()),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        title: sanitizePlain(title.trim()),
        content: sanitizePlain(content.trim()),
        category: category || "general",
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit story" }, { status: 500 });
  }
}
