"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
// import initTranslations from "@/app/i18n";
import { ReactNode } from "react";

interface TranslationsProviderProps {
  children: ReactNode;
  locale: string;
  namespaces: string[];
  resources: Record<string, Record<string, string>>;
}

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationsProviderProps) {
  const i18n = createInstance();

  i18n.init({
    lng: locale,
    resources,
    ns: namespaces,
    defaultNS: namespaces[0],
    fallbackLng: locale,
  });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
