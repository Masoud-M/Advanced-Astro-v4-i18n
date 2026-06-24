import { loadTranslations } from "./loadTranslations";

function detectI18nEnabled() {
  const modules = import.meta.glob("../js/translationUtils.ts");

  return Object.keys(modules).length > 0;
}

const i18nEnabled = detectI18nEnabled();

export function getContent(locale?: string) {
  if (i18nEnabled) {
    return loadTranslations(locale ?? "en");
  }

  // BASIC MODE:
  // ignore locale completely
  return loadTranslations("en");
}
