import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function saveAdsenseSettings(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/admin");

  const googleAdsenseId = (formData.get("googleAdsenseId") as string) || null;

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    create: { id: "default", googleAdsenseId },
    update: { googleAdsenseId },
  });

  revalidatePath("/");
  revalidatePath("/admin/ads");
}

async function saveMetaPixelSettings(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/admin");

  const metaPixelId = (formData.get("metaPixelId") as string) || null;

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    create: { id: "default", metaPixelId },
    update: { metaPixelId },
  });

  revalidatePath("/");
  revalidatePath("/admin/ads");
}

async function saveWeatherSettings(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/admin");

  const weatherApiKey = (formData.get("weatherApiKey") as string) || null;
  const weatherCity = (formData.get("weatherCity") as string) || null;

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    create: { id: "default", weatherApiKey, weatherCity },
    update: { weatherApiKey, weatherCity },
  });

  revalidatePath("/");
  revalidatePath("/admin/ads");
}

const POSITIONS = [
  { value: "homepage_leaderboard", label: "Homepage – Leaderboard (below hero)" },
  { value: "homepage_sidebar", label: "Homepage – Sidebar" },
  { value: "article_sidebar", label: "Article – Sidebar" },
  { value: "article_banner", label: "Article – Banner (after content)" },
  { value: "article_inline", label: "Article – Inline (between paragraphs)" },
  { value: "category_banner", label: "Category – Banner" },
];

async function createAd(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/admin");

  await prisma.ad.create({
    data: {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      imageUrl: formData.get("imageUrl") as string || null,
      linkUrl: formData.get("linkUrl") as string || null,
      code: formData.get("code") as string || null,
      adSenseSlot: formData.get("adSenseSlot") as string || null,
      adSenseFormat: formData.get("adSenseFormat") as string || "auto",
      active: formData.get("active") === "on",
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/ads");
  redirect("/admin/ads");
}

async function deleteAd(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/admin");

  await prisma.ad.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/");
  revalidatePath("/admin/ads");
}

async function toggleAd(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/admin");

  const id = formData.get("id") as string;
  const current = await prisma.ad.findUnique({ where: { id } });
  if (current) {
    await prisma.ad.update({ where: { id }, data: { active: !current.active } });
  }
  revalidatePath("/");
  revalidatePath("/admin/ads");
}

export default async function AdminAdsPage() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/admin");

  const ads = await prisma.ad.findMany({
    orderBy: [{ position: "asc" }, { sortOrder: "asc" }],
  });

  const adsByPosition: Record<string, typeof ads> = {};
  for (const ad of ads) {
    if (!adsByPosition[ad.position]) adsByPosition[ad.position] = [];
    adsByPosition[ad.position].push(ad);
  }

  const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Ad Placements</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage advertisements and Google AdSense across the site
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {POSITIONS.map((pos) => {
            const positionAds = adsByPosition[pos.value] || [];
            return (
              <div key={pos.value} className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                <div className="border-b border-zinc-200 px-4 py-3 bg-zinc-50">
                  <h2 className="text-sm font-semibold text-zinc-700">{pos.label}</h2>
                </div>
                {positionAds.length > 0 ? (
                  <div className="divide-y divide-zinc-100">
                    {positionAds.map((ad) => (
                      <div key={ad.id} className="flex items-center gap-4 px-4 py-3">
                        <div className="w-16 h-12 shrink-0 rounded bg-zinc-100 overflow-hidden">
                          {ad.imageUrl ? (
                            <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : ad.adSenseSlot ? (
                            <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-500 text-[10px] font-bold">AdSense</div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs">&lt;/&gt;</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">{ad.name}</p>
                          <p className="text-xs text-zinc-400">
                            #{ad.sortOrder}
                            {ad.linkUrl && " · Has link"}
                            {ad.code && " · Custom code"}
                            {ad.adSenseSlot && ` · AdSense: ${ad.adSenseSlot}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <form action={toggleAd}>
                            <input type="hidden" name="id" value={ad.id} />
                            <button
                              type="submit"
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                                ad.active ? "bg-primary" : "bg-zinc-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                  ad.active ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </form>
                          <form action={deleteAd}>
                            <input type="hidden" name="id" value={ad.id} />
                            <button
                              type="submit"
                              className="text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-4 py-6 text-sm text-zinc-400 text-center">No ads in this position yet.</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          {/* Google AdSense Settings */}
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Google AdSense</h2>
            <p className="text-xs text-zinc-400 mb-4">
              Enter your publisher ID to enable auto ads site-wide. Ad units can also be created per position below.
            </p>
            <form action={saveAdsenseSettings} className="space-y-3">
              <div>
                <label htmlFor="googleAdsenseId" className="block text-sm font-medium text-zinc-700 mb-1">
                  Publisher ID
                </label>
                <input
                  type="text"
                  id="googleAdsenseId"
                  name="googleAdsenseId"
                  defaultValue={config?.googleAdsenseId ?? ""}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1 text-xs text-zinc-400">
                  Found in your AdSense account &rarr; Settings &rarr; Account info
                </p>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                Save AdSense Settings
              </button>
            </form>
            {config?.googleAdsenseId && (
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                AdSense script active
              </div>
            )}
          </div>

          {/* Meta Pixel Settings */}
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Meta Pixel</h2>
            <p className="text-xs text-zinc-400 mb-4">
              Enter your Meta (Facebook) Pixel ID to track page views and events.
            </p>
            <form action={saveMetaPixelSettings} className="space-y-3">
              <div>
                <label htmlFor="metaPixelId" className="block text-sm font-medium text-zinc-700 mb-1">
                  Pixel ID
                </label>
                <input
                  type="text"
                  id="metaPixelId"
                  name="metaPixelId"
                  defaultValue={config?.metaPixelId ?? ""}
                  placeholder="123456789012345"
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1 text-xs text-zinc-400">
                  Found in Meta Events Manager &rarr; Data Sources &rarr; Pixel
                </p>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                Save Meta Pixel
              </button>
            </form>
            {config?.metaPixelId && (
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Meta Pixel active
              </div>
            )}
          </div>

          {/* Weather Settings */}
          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Weather</h2>
            <p className="text-xs text-zinc-400 mb-4">
              Configure weather display in the header. Uses OpenWeatherMap API.
            </p>
            <form action={saveWeatherSettings} className="space-y-3">
              <div>
                <label htmlFor="weatherApiKey" className="block text-sm font-medium text-zinc-700 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  id="weatherApiKey"
                  name="weatherApiKey"
                  defaultValue={config?.weatherApiKey ?? ""}
                  placeholder="OpenWeatherMap API key"
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1 text-xs text-zinc-400">
                  Get a free key at <span className="font-mono">openweathermap.org/api</span>
                </p>
              </div>
              <div>
                <label htmlFor="weatherCity" className="block text-sm font-medium text-zinc-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="weatherCity"
                  name="weatherCity"
                  defaultValue={config?.weatherCity ?? "Accra"}
                  placeholder="Accra"
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                Save Weather Settings
              </button>
            </form>
            {config?.weatherApiKey && (
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Weather active
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-8">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">New Ad</h2>
            <form action={createAd} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">Ad Name</label>
                <input type="text" id="name" name="name" required
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-zinc-700 mb-1">Position</label>
                <select id="position" name="position" required
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {POSITIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-700 mb-1">Image URL</label>
                <input type="url" id="imageUrl" name="imageUrl"
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="linkUrl" className="block text-sm font-medium text-zinc-700 mb-1">Link URL (optional)</label>
                <input type="url" id="linkUrl" name="linkUrl"
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-zinc-700 mb-1">Custom Code (HTML/script)</label>
                <textarea id="code" name="code" rows={3}
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Overrides image URL when set"
                />
              </div>
              <hr className="border-zinc-200" />
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">— Or use AdSense —</p>
              <div>
                <label htmlFor="adSenseSlot" className="block text-sm font-medium text-zinc-700 mb-1">AdSense Ad Unit ID</label>
                <input type="text" id="adSenseSlot" name="adSenseSlot"
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label htmlFor="adSenseFormat" className="block text-sm font-medium text-zinc-700 mb-1">Format</label>
                <select id="adSenseFormat" name="adSenseFormat"
                  className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="auto">Auto (responsive)</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                  <option value="rectangle">Rectangle</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="active" name="active" defaultChecked
                    className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="active" className="text-sm text-zinc-600">Active</label>
                </div>
                <div>
                  <label htmlFor="sortOrder" className="text-sm text-zinc-600 mr-1">Order</label>
                  <input type="number" id="sortOrder" name="sortOrder" defaultValue={0} min={0}
                    className="w-16 rounded border border-zinc-300 px-2 py-1 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <button type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Create Ad
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
