import { getContent } from "./getContent";
import { getHrefLangLinks } from "../features/i18n/getHrefLangLinks";
import { getLocaleFromUrl } from "../features/i18n/localeUtils";

export async function getSiteContext(url: URL) {
  const locale = getLocaleFromUrl(url);

  const [content, alternates] = await Promise.all([
    getContent(locale),
    getHrefLangLinks(url),
  ]);

  return {
    locale,
    lang: locale,
    content,
    alternates,
  };
}
