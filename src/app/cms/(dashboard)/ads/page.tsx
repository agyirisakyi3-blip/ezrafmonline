import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function saveAdsenseSettings(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/cms");

  const googleAdsenseId = (formData.get("googleAdsenseId") as string) || null;

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    create: { id: "default", googleAdsenseId },
    update: { googleAdsenseId },
  });

  revalidatePath("/");
  revalidatePath("/cms/ads");
}

async function saveMetaPixelSettings(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/cms");

  const metaPixelId = (formData.get("metaPixelId") as string) || null;

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    create: { id: "default", metaPixelId },
    update: { metaPixelId },
  });

  revalidatePath("/");
  revalidatePath("/cms/ads");
}

async function saveLiveRadioSettings(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/cms");

  const liveRadioUrl = (formData.get("liveRadioUrl") as string) || null;
  const liveRadioActive = formData.get("liveRadioActive") === "on";

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    create: { id: "default", liveRadioUrl, liveRadioActive },
    update: { liveRadioUrl, liveRadioActive },
  });

  revalidatePath("/");
  revalidatePath("/live/radio");
  revalidatePath("/cms/ads");
}

async function saveWeatherSettings(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/cms");

  const weatherApiKey = (formData.get("weatherApiKey") as string) || null;
  const weatherCity = (formData.get("weatherCity") as string) || null;

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    create: { id: "default", weatherApiKey, weatherCity },
    update: { weatherApiKey, weatherCity },
  });

  revalidatePath("/");
  revalidatePath("/cms/ads");
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
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/cms");

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
  revalidatePath("/cms/ads");
  redirect("/cms/ads");
}

async function deleteAd(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/cms");

  await prisma.ad.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/");
  revalidatePath("/cms/ads");
}

async function toggleAd(formData: FormData) {
  "use server";
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/cms");

  const id = formData.get("id") as string;
  const current = await prisma.ad.findUnique({ where: { id } });
  if (current) {
    await prisma.ad.update({ where: { id }, data: { active: !current.active } });
  }
  revalidatePath("/");
  revalidatePath("/cms/ads");
}

export default async function AdminAdsPage() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") redirect("/cms");

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Ad Placements</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage advertisements and Google AdSense across the site
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {POSITIONS.map((pos) => {
            const positionAds = adsByPosition[pos.value] || [];
            return (
              <div key={pos.value} className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
                <div className="border-b border-zinc-100 px-5 py-4 bg-zinc-50/50">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-zinc-700">{pos.label}</h2>
                    {positionAds.length > 0 && (
                      <span className="text-[10px] font-medium text-zinc-400 bg-white px-2 py-0.5 rounded-lg">{positionAds.length} ads</span>
                    )}
                  </div>
                </div>
                {positionAds.length > 0 ? (
                  <div className="divide-y divide-zinc-100">
                    {positionAds.map((ad) => (
                      <div key={ad.id} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50/80 transition-colors group">
                        <div className="w-16 h-12 shrink-0 rounded-xl bg-zinc-100 overflow-hidden ring-1 ring-zinc-200/50">
                          {ad.imageUrl ? (
                            <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : ad.adSenseSlot ? (
                            <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-500 text-[10px] font-bold">AdSense</div>
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
                        <div className="flex items-center gap-2.5">
                          <form action={toggleAd}>
                            <input type="hidden" name="id" value={ad.id} />
                            <button
                              type="submit"
                              className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                                ad.active ? "bg-primary" : "bg-zinc-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                                  ad.active ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </form>
                          <form action={deleteAd}>
                            <input type="hidden" name="id" value={ad.id} />
                            <button
                              type="submit"
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-5 py-8 text-sm text-zinc-400 text-center">No ads in this position yet.</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          {/* Google AdSense Settings */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Google AdSense</h2>
                <p className="text-xs text-zinc-400">Publisher ID for auto ads</p>
              </div>
            </div>
            <form action={saveAdsenseSettings} className="space-y-3">
              <input
                type="text"
                id="googleAdsenseId"
                name="googleAdsenseId"
                defaultValue={config?.googleAdsenseId ?? ""}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-mono focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/25"
              >
                Save AdSense Settings
              </button>
            </form>
            {config?.googleAdsenseId && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AdSense script active
              </div>
            )}
          </div>

          {/* Meta Pixel Settings */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-sky-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.16a15.53 15.53 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Meta Pixel</h2>
                <p className="text-xs text-zinc-400">Facebook Pixel tracking ID</p>
              </div>
            </div>
            <form action={saveMetaPixelSettings} className="space-y-3">
              <input
                type="text"
                id="metaPixelId"
                name="metaPixelId"
                defaultValue={config?.metaPixelId ?? ""}
                placeholder="123456789012345"
                className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-mono focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/25"
              >
                Save Meta Pixel
              </button>
            </form>
            {config?.metaPixelId && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Meta Pixel active
              </div>
            )}
          </div>

          {/* Live Radio Settings */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-rose-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Live Radio Stream</h2>
                <p className="text-xs text-zinc-400">Audio stream URL for live broadcasting</p>
              </div>
            </div>
            <form action={saveLiveRadioSettings} className="space-y-3">
              <input
                type="text"
                id="liveRadioUrl"
                name="liveRadioUrl"
                defaultValue={config?.liveRadioUrl ?? ""}
                placeholder="https://your-stream-url.com/stream"
                className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-mono focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-colors placeholder:text-zinc-400"
              />
              <label className="flex items-center gap-2.5 text-sm text-zinc-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="liveRadioActive"
                  defaultChecked={config?.liveRadioActive === true}
                  className="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
                />
                Stream is live — show player on site
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/25"
              >
                Save Stream Settings
              </button>
            </form>
            {config?.liveRadioActive && config?.liveRadioUrl && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Stream active
              </div>
            )}
          </div>

          {/* Weather Settings */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-cyan-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">Weather</h2>
                <p className="text-xs text-zinc-400">OpenWeatherMap API config</p>
              </div>
            </div>
            <form action={saveWeatherSettings} className="space-y-3">
              <input
                type="text"
                id="weatherApiKey"
                name="weatherApiKey"
                defaultValue={config?.weatherApiKey ?? ""}
                placeholder="OpenWeatherMap API key"
                className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-mono focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors placeholder:text-zinc-400"
              />
              <input
                type="text"
                id="weatherCity"
                name="weatherCity"
                defaultValue={config?.weatherCity ?? "Accra"}
                placeholder="City name"
                className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/25"
              >
                Save Weather Settings
              </button>
            </form>
            {config?.weatherApiKey && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Weather active
              </div>
            )}
          </div>

          {/* New Ad */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">New Ad</h2>
                <p className="text-xs text-zinc-400">Create a new ad placement</p>
              </div>
            </div>
            <form action={createAd} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1.5">Ad Name</label>
                <input type="text" id="name" name="name" required placeholder="e.g. Homepage Banner"
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-zinc-700 mb-1.5">Position</label>
                <select id="position" name="position" required
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                >
                  {POSITIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-700 mb-1.5">Image URL</label>
                <input type="url" id="imageUrl" name="imageUrl" placeholder="https://..."
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                />
              </div>
              <div>
                <label htmlFor="linkUrl" className="block text-sm font-medium text-zinc-700 mb-1.5">Link URL</label>
                <input type="url" id="linkUrl" name="linkUrl" placeholder="https://..."
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-zinc-700 mb-1.5">Custom Code (HTML)</label>
                <textarea id="code" name="code" rows={2}
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                  placeholder="Overrides image URL when set"
                />
              </div>
              <hr className="border-zinc-200" />
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">— Or use AdSense —</p>
              <div>
                <label htmlFor="adSenseSlot" className="block text-sm font-medium text-zinc-700 mb-1.5">AdSense Ad Unit ID</label>
                <input type="text" id="adSenseSlot" name="adSenseSlot" placeholder="1234567890"
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                />
              </div>
              <div>
                <label htmlFor="adSenseFormat" className="block text-sm font-medium text-zinc-700 mb-1.5">Format</label>
                <select id="adSenseFormat" name="adSenseFormat"
                  className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                >
                  <option value="auto">Auto (responsive)</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                  <option value="rectangle">Rectangle</option>
                </select>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input type="checkbox" id="active" name="active" defaultChecked
                    className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
                  />
                  Active
                </label>
                <div className="flex items-center gap-2">
                  <label htmlFor="sortOrder" className="text-sm text-zinc-600">Order</label>
                  <input type="number" id="sortOrder" name="sortOrder" defaultValue={0} min={0}
                    className="w-16 rounded-xl border border-zinc-300 px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <button type="submit"
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
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
