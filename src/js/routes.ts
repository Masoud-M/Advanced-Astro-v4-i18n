import { defaultLocale } from "../features/i18n/config";

function normalizePath(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;

  // ensure trailing slash (Astro: trailingSlash: "always")
  if (!path.endsWith("/")) path = `${path}/`;

  return path;
}

export function getRoute(locale: string | undefined, path: string) {
  const cleanPath = normalizePath(path);

  if (!locale || locale === defaultLocale) {
    return cleanPath;
  }

  return normalizePath(`/${locale}${cleanPath}`);
}

// AFTER REMOVING THE i18n IT SHOULD LOOK LIKE THIS
// export function getRoute(path: string) {
//   return path;
// }
