import { locales, defaultLocale, type Locale } from "@config/siteSettings";

export function formatDate(date: string | number | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/** Extract locale from a URL pathname. Returns defaultLocale if no locale prefix found. */
export function getLocaleFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split("/");
  if (locales.includes(segment as Locale)) {
    return segment as Locale;
  }
  return defaultLocale;
}
