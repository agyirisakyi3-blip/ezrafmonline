"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GoogleAdsense({ publisherId }: { publisherId: string }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/cms");

  useEffect(() => {
    if (!isAdmin && (window as any).adsbygoogle) {
      try {
        (window as any).adsbygoogle.push({});
      } catch {}
    }
  }, [pathname, isAdmin]);

  if (isAdmin) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
