import { locales, localeMap } from "src/features/i18n/config";
import { getLocalizedPathname } from "./routing/getLocalizedPathname";

export async function getHrefLangLinks(url: URL) {
  return Promise.all(
    locales.map(async (locale) => ({
      hreflang: localeMap[locale],
      href: new URL(await getLocalizedPathname(locale, url), url.origin).href,
    })),
  );
}
