import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";

const url = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_tPo2qLzRKlA1@ep-autumn-forest-apxs75z7.c-7.us-east-1.aws.neon.tech/neondb?sslmode=verify-full";
const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { name: "News", slug: "news" },
  { name: "Politics", slug: "politics" },
  { name: "Business", slug: "business" },
  { name: "Sports", slug: "sports" },
  { name: "Entertainment", slug: "entertainment" },
  { name: "Opinion", slug: "opinion" },
  { name: "Videos", slug: "videos" },
  { name: "Elections", slug: "elections" },
];

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
    where: { email: "jane@newsportal.com" },
    update: {},
    create: {
      name: "Jane Editor",
      email: "jane@newsportal.com",
      password: await hash("test123456", 12),
      role: "EDITOR",
    },
  });

  console.log("Editor user created:", editor.email);

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log(`${CATEGORIES.length} categories created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
