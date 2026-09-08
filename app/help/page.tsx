import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PublicPage } from "@/components/public-site";
export default async function HelpPage() {
  const t = await getTranslations("Public.help");
  const qs = [0, 1, 2];
  return (
    <PublicPage eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
      <div className="mt-10 grid gap-4">
        {qs.map((i) => (
          <article key={i} className="border-b border-border pb-5">
            <h2 className="font-semibold">{t(`questions.${i}.q`)}</h2>
            <p className="mt-2 text-sm leading-6 text-primary/70">
              {t(`questions.${i}.a`)}
            </p>
          </article>
        ))}
      </div>
      <Link
        className="mt-8 inline-block text-sm font-semibold underline"
        href="/contact"
      >
        {t("contact")}
      </Link>
    </PublicPage>
  );
}
