import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["en", "es", "fr"] as const;
export const defaultLocale = "en";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = locales.includes(cookieLocale as (typeof locales)[number])
    ? (cookieLocale as (typeof locales)[number])
    : locales.includes(requestedLocale as (typeof locales)[number])
      ? (requestedLocale as (typeof locales)[number])
      : defaultLocale;

  const baseMessages = (await import(`../messages/${defaultLocale}.json`)).default;
  const localeMessages = locale === defaultLocale
    ? {}
    : (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages: mergeMessages(baseMessages, localeMessages),
  };
});

function mergeMessages(base: Record<string, unknown>, overrides: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(base).map(([key, value]) => [
      key,
      value && typeof value === "object" && !Array.isArray(value)
        ? mergeMessages(value as Record<string, unknown>, (overrides[key] as Record<string, unknown>) ?? {})
        : overrides[key] ?? value,
    ]),
  );
}
