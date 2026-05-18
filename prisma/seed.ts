import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@newsportal.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@newsportal.com",
      password,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", admin.email);

  const editor = await prisma.user.upsert({
    where: { email: "editor@newsportal.com" },
    update: {},
    create: {
      name: "Editor",
      email: "editor@newsportal.com",
      password,
      role: "EDITOR",
    },
  });

  console.log("Editor user created:", editor.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
