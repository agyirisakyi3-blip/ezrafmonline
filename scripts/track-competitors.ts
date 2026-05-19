import { readFileSync, writeFileSync, existsSync } from "fs";
import Parser from "rss-parser";
import { join } from "path";

const parser = new Parser();

interface Competitor {
  name: string;
  site: string;
  rss: string;
  category: string;
}

interface Article {
  title: string;
  link: string;
  pubDate: string;
  isoDate?: string;
  contentSnippet?: string;
}

const HISTORY_FILE = join(import.meta.dirname, ".tracker-history.json");

function loadHistory(): Record<string, string[]> {
  if (existsSync(HISTORY_FILE)) {
    return JSON.parse(readFileSync(HISTORY_FILE, "utf-8"));
  }
  return {};
}

function saveHistory(history: Record<string, string[]>) {
  writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

async function fetchFeed(competitor: Competitor): Promise<{ new: Article[]; total: number }> {
  try {
    const feed = await parser.parseURL(competitor.rss);
    const items = (feed.items || []) as Article[];
    const history = loadHistory();
    const seen = history[competitor.site] || [];

    const newArticles = items.filter((item) => {
      const id = item.link || item.title;
      return id && !seen.includes(id);
    });

    const latestLinks = items.slice(0, 20).map((item) => item.link || item.title || "");
    history[competitor.site] = latestLinks;
    saveHistory(history);

    return { new: newArticles.slice(0, 10), total: items.length };
  } catch (err) {
    console.error(`  ✗ Failed to fetch ${competitor.name}: ${(err as Error).message}`);
    return { new: [], total: 0 };
  }
}

async function main() {
  const raw = readFileSync(join(import.meta.dirname, "competitors.json"), "utf-8");
  const competitors: Competitor[] = JSON.parse(raw);

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║         COMPETITOR TRACKER REPORT                ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  const results: Array<{ name: string; total: number; newCount: number; newArticles: Article[] }> = [];

  for (const comp of competitors) {
    process.stdout.write(`  Fetching ${comp.name}... `);
    const { new: newArticles, total } = await fetchFeed(comp);
    console.log(`✓ (${total} total, ${newArticles.length} new)`);
    results.push({ name: comp.name, total, newCount: newArticles.length, newArticles });
  }

  console.log("\n────────────────────────────────────────────────────");
  console.log("  SUMMARY");
  console.log("────────────────────────────────────────────────────\n");

  let totalNew = 0;
  for (const r of results) {
    const status = r.newCount > 0 ? "🆕" : "✓";
    console.log(`  ${status} ${r.name.padEnd(22)} ${r.total.toString().padStart(3)} articles  (${r.newCount} new)`);
    totalNew += r.newCount;
  }

  console.log(`\n  Total new articles since last check: ${totalNew}\n`);

  const hasNew = results.filter((r) => r.newCount > 0);
  if (hasNew.length > 0) {
    console.log("────────────────────────────────────────────────────");
    console.log("  NEW ARTICLES");
    console.log("────────────────────────────────────────────────────\n");

    for (const r of hasNew) {
      console.log(`  ── ${r.name} ──`);
      for (const article of r.newArticles) {
        const date = article.isoDate
          ? new Date(article.isoDate).toLocaleDateString("en-GB")
          : "";
        console.log(`    ${date}  ${article.title.slice(0, 90)}`);
        console.log(`          ${article.link}`);
        console.log();
      }
    }
  }

  console.log("────────────────────────────────────────────────────\n");
  console.log("  Next step: Check which topics they covered that you didn't.\n");
}

main().catch(console.error);
