import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

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
