import Image from "next/image";
import { getActiveAds, getSiteConfig } from "@/lib/ads";

interface AdSlotProps {
  position: string;
  className?: string;
}

export default async function AdSlot({ position, className = "" }: AdSlotProps) {
  const ads = await getActiveAds(position);
  if (ads.length === 0) return null;

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-widest text-zinc-300 font-medium">
          Advertisement
        </span>
      </div>
      <div className="flex justify-center">
        {ads.map((ad) => {
          if (ad.code) {
            return (
              <div
                key={ad.id}
                className="ad-container"
                dangerouslySetInnerHTML={{ __html: ad.code }}
              />
            );
          }
          if (ad.adSenseSlot) {
            return <AdSenseUnit key={ad.id} ad={{ adSenseSlot: ad.adSenseSlot, adSenseFormat: ad.adSenseFormat, name: ad.name }} />;
          }
          if (ad.imageUrl) {
            return (
              <a
                key={ad.id}
                href={ad.linkUrl || "#"}
                target={ad.linkUrl ? "_blank" : undefined}
                rel={ad.linkUrl ? "noopener noreferrer" : undefined}
                className="block"
              >
                <Image
                  src={ad.imageUrl}
                  alt={ad.name}
                  width={728}
                  height={90}
                  className="max-w-full h-auto"
                  sizes="100vw"
                />
              </a>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

async function AdSenseUnit({ ad }: { ad: { adSenseSlot: string; adSenseFormat: string | null; name: string } }) {
  const config = await getSiteConfig();
  if (!config?.googleAdsenseId) return null;

  const format = ad.adSenseFormat || "auto";

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${config.googleAdsenseId}"
     data-ad-slot="${ad.adSenseSlot}"
     data-ad-format="${format}"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`.trim(),
      }}
    />
  );
}
