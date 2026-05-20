"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { auth } from "@/lib/auth";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

function generatePassword(length = 12): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + digits + symbols;

  const buf = crypto.randomBytes(length);
  const password = Array.from(buf)
    .map((b) => all[b % all.length])
    .join("");

  // Ensure at least one char from each category
  const hasUpper = Array.from(password).some((c) => upper.includes(c));
  const hasLower = Array.from(password).some((c) => lower.includes(c));
  const hasDigit = Array.from(password).some((c) => digits.includes(c));
  const hasSymbol = Array.from(password).some((c) => symbols.includes(c));

  if (hasUpper && hasLower && hasDigit && hasSymbol) return password;
  return generatePassword(length);
}

export async function createUser(
  _prev: { success?: boolean; email?: string; generatedPassword?: string; error?: string } | null,
  formData: FormData,
): Promise<{ success?: boolean; email?: string; generatedPassword?: string; error?: string } | null> {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const role = formData.get("role") as string;

  if (!name || !email || !["ADMIN", "EDITOR"].includes(role)) {
    return { error: "Name, email, and role are required" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "A user with this email already exists" };
  }

  const generatedPassword = generatePassword();
  const hashedPassword = await hash(generatedPassword, 12);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: role as any },
  });

  if (process.env.NODE_ENV === "development") {
    console.log(`[Create User] ${email} — generated password: ${generatedPassword}`);
  }

  revalidatePath("/cms/users");

  return {
    success: true,
    email,
    generatedPassword,
  };
}
