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

// AFTER DELETING I18N IT BECOMES LIKE THIS
// import { getContent } from "./getContent";

// export async function getSiteContext(url: URL) {
// 	const content = await getContent("en");

// 	return {
// 		locale: "en",
// 		lang: "en",
// 		content,
// 		alternates: [],
// 	};
// }
