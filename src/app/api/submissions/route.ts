import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { authorName, email, phone, title, content, category } = await req.json();

    if (!authorName?.trim() || !title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Name, title, and content are required" },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: "Title must be under 200 characters" },
        { status: 400 }
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { error: "Content must be under 10,000 characters" },
        { status: 400 }
      );
    }

    await prisma.citizenSubmission.create({
      data: {
        authorName: authorName.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        title: title.trim(),
        content: content.trim(),
        category: category || "general",
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit story" }, { status: 500 });
  }
}
