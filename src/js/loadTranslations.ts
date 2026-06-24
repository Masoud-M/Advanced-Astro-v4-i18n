export function loadTranslations(locale: string) {
  const modules = import.meta.glob("../locales/**/**/*.json", {
    eager: true,
  });

  const result: Record<string, any> = {};

  for (const path in modules) {
    // only include matching locale folder
    if (!path.includes(`/${locale}/`)) continue;

    const mod = modules[path] as any;
    const data = mod.default ?? mod;

    deepMerge(result, data);
  }

  return result;
}

function deepMerge(target: any, source: any) {
  for (const key in source) {
    if (typeof source[key] === "object" && !Array.isArray(source[key])) {
      target[key] ??= {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}
