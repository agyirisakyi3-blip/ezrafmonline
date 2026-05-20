import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/security";
import { z } from "zod";
import crypto from "crypto";

const forgotSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "forgot:post";
  if (!checkRateLimit(`forgot:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const json = await req.json();
    const result = forgotSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "If that email exists, a reset link has been sent." }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    const resetUrl = `${process.env.AUTH_URL || "http://localhost:3001"}/cms/login?reset_token=${token}`;

    if (process.env.NODE_ENV === "development") {
      console.log(`[Password Reset] ${email}: ${resetUrl}`);
    }

    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
