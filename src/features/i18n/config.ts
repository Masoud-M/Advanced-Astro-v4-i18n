export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMap = {
  en: "en-US",
  fr: "fr-FR",
};

export const languageSwitcherMap = {
  en: "EN",
  fr: "FR",
};

export const routeTranslations: Record<Locale, Record<string, string>> = {
  en: {
    about: "about",
    projects: "projects",
    "project-1": "project-1",
    "project-2": "project-2",
    reviews: "reviews",
  },
  fr: {
    about: "a-propos",
    projects: "projets",
    "project-1": "projet-1",
    "project-2": "projet-2",
    reviews: "avis",
  },
};

export const localizedCollections = {
  blog: { en: "blog", fr: "blog" },
} as const;
