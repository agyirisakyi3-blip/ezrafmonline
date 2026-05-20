import { prisma } from "../src/lib/prisma";

const programs = [
  { title: "Ezra Adekyee", host: "Rev. Kofi Asante Ennin & Sir Mike", startTime: "06:30", endTime: "10:00", days: "weekdays", description: "Morning drive-time show", sortOrder: 0 },
  { title: "Makosem", host: "Otwinoko", startTime: "11:00", endTime: "14:00", days: "weekdays", description: "Midday talk show", sortOrder: 1 },
  { title: "Live Worship", host: "Bishop Okatakyie Afrifa", startTime: "14:00", endTime: "15:00", days: "weekdays", description: "Afternoon worship session", sortOrder: 2 },
  { title: "Ezra Sports Drive", host: "Little King", startTime: "15:00", endTime: "18:00", days: "weekdays", description: "Sports news and analysis", sortOrder: 3 },
  { title: "Ezra Kasiebo", host: null, startTime: "18:00", endTime: "19:00", days: "weekdays", description: "Evening news bulletin", sortOrder: 4 },
  { title: "Ayehu", host: "Adusi Poku", startTime: "19:00", endTime: "21:00", days: "weekdays", description: "Night life and entertainment", sortOrder: 5 },
];

async function main() {
  const existing = await prisma.radioProgram.count();
  if (existing > 0) {
    console.log(`${existing} programs already exist. Skipping seed.`);
    return;
  }

  for (const p of programs) {
    await prisma.radioProgram.create({ data: p });
    console.log(`  Created: ${p.title}`);
  }

  console.log(`\nSeeded ${programs.length} radio programs.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
