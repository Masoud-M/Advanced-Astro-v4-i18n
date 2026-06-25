function normalizePath(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;

  // ensure trailing slash (Astro: trailingSlash: "always")
  if (!path.endsWith("/")) path = `${path}/`;
  return path;
}

export function getRoute(locale: string | undefined, path: string) {
  const cleanPath = normalizePath(path);

  if (!locale || locale === "en") {
    return cleanPath;
  }

  return normalizePath(`/${locale}${cleanPath}`);
}
