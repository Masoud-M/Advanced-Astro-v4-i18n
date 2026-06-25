import {
  locales,
  defaultLocale,
  type Locale,
} from "src/features/i18n/config.ts";

/** Filter a content collection array to entries whose ID starts with the given locale prefix. */
export function filterCollectionByLanguage<T extends { id: string }>(
  collection: T[],
  locale: Locale,
): T[] {
  return collection.filter((entry) => entry.id.startsWith(`${locale}/`));
}

/** Extract locale from a URL pathname. Returns defaultLocale if no locale prefix found. */
export function getLocaleFromUrl(url: URL): Locale {
  const [segment] = url.pathname.split("/");
  if (locales.includes(segment as Locale)) {
    return segment as Locale;
  }
  return defaultLocale;
}
