import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { i18nConfig } from "@/i18nConfig";

export default async function initTranslations(
  locale: string,
  namespaces: string[] = ["translation"]
) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      defaultNS: namespaces[0],
      fallbackNS: namespaces[0],
      ns: namespaces,
      preload: typeof window === "undefined" ? i18nConfig.locales : [],
    });

  return {
    // t: i18nInstance.getFixedT(locale, namespaces[0]),
    // i18n: i18nInstance,
    i18n: i18nInstance,
    t: i18nInstance.t,
    resources: i18nInstance.services.resourceStore.data,
  };
}
