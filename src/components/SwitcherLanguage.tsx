"use client";
import { Select } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { i18nConfig } from "@/i18nConfig";

export default function LanguageChanger({ locale }: { locale: string }) {
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (newLocale: string) => {
    const segments = currentPathname.split("/");
    if (segments.length > 1 && i18nConfig.locales.includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newUrl = segments.join("/");
    router.push(newUrl);
    router.refresh();
  };

  return (
    <>
      <Select
        defaultValue={locale}
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: "en", label: "EN" },
          { value: "th", label: "TH" },
        ]}
      />
    </>
  );
}
