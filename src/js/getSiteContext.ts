import { getContent } from "./getContent";
import { getHrefLangLinks } from "./getHrefLangLinks";

import { getLocaleFromUrl } from "./utils";

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
