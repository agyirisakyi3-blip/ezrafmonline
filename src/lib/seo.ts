const SITE_NAME = "Ezrafmonline";
const SITE_URL = process.env.AUTH_URL || "http://localhost:3001";
const DEFAULT_DESC = "Latest news, breaking stories and updates";

export function siteMetadata({
  title,
  description = DEFAULT_DESC,
  path = "",
  image,
  publishedAt,
  updatedAt,
  author,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  author?: string | null;
}) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title === "Home" ? SITE_NAME : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: (publishedAt ? "article" : "website") as "article" | "website",
      ...(publishedAt && {
        publishedTime: publishedAt.toISOString(),
        modifiedTime: (updatedAt || publishedAt).toISOString(),
      }),
      ...(author && { authors: [author] }),
      ...(image && {
        images: [{ url: image, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image" as const,
      title: fullTitle,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export function articleJsonLd({
  title,
  description,
  url,
  image,
  publishedAt,
  updatedAt,
  author,
  category,
}: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  publishedAt: Date;
  updatedAt: Date;
  author?: string | null;
  category?: string | null;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: publishedAt.toISOString(),
    dateModified: updatedAt.toISOString(),
    inLanguage: "en",
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };
  if (image) {
    data.image = [image];
  }
  if (author) {
    data.author = { "@type": "Person", name: author };
  }
  if (category) {
    data.articleSection = category;
  }
  return data;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://facebook.com/ezrafmonline",
      "https://twitter.com/ezrafmonline",
    ],
  };
}
