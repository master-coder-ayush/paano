"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Globe2 } from "lucide-react";

const languages = ["en", "es", "fr"] as const;

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Common.language");

  function changeLanguage(nextLocale: string) {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <label className="relative mt-5 block h-10 text-xs text-primary/65 transition-[width] duration-200 lg:w-10 lg:overflow-hidden lg:group-hover:w-full">
      <span className="sr-only">{t("label")}</span>
      <Globe2 className="pointer-events-none absolute left-2.5 top-1/2 z-10 size-4 -translate-y-1/2 text-primary/70" aria-hidden="true" />
      <select
        aria-label={t("label")}
        className="h-10 w-full appearance-none border border-border bg-surface pl-9 pr-8 text-sm text-primary outline-none transition-colors hover:bg-accent/20 focus:border-primary focus:ring-1 focus:ring-primary/20 lg:w-10 lg:group-hover:w-full"
        value={locale}
        onChange={(event) => changeLanguage(event.target.value)}
      >
        {languages.map((language) => (
          <option key={language} value={language}>{t(language)}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-primary/60" aria-hidden="true" />
    </label>
  );
}
