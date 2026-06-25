import { getLocalizedPathname } from "@js/translationUtils";
import { locales, localeMap } from "@config/siteSettings";

export async function getHrefLangLinks(url: URL) {
  return Promise.all(
    locales.map(async (locale) => ({
      hreflang: localeMap[locale],
      href: new URL(await getLocalizedPathname(locale, url), url.origin).href,
    })),
  );
}
