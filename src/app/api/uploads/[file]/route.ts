import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file: filename } = await params;

  // Prevent directory traversal
  if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  const isVercel = !!process.env.VERCEL;
  const filePath = isVercel
    ? path.join("/tmp", "uploads", filename)
    : path.join(process.cwd(), "public", "uploads", filename);

  try {
    const buffer = await readFile(filePath);

    const ext = path.extname(filename).toLowerCase();
    const mime: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
    };

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
