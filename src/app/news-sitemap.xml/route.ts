import newsSitemap from "../news-sitemap";

export async function GET() {
  const xml = await newsSitemap();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
