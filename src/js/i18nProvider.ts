import { loadTranslations } from "./loadTranslations";

export function createContent(locale: string) {
  return loadTranslations(locale);
}
