import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/security";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "newsletter:post";
  if (!checkRateLimit(`newsletter:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const json = await req.json();
    const result = newsletterSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 },
      );
    }

    const { email } = result.data;

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }

    await prisma.subscriber.create({ data: { email } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
