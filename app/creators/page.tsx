import { getTranslations } from "next-intl/server";
import { CTA, PublicPage } from "@/components/public-site";
export default async function CreatorsPage() {
  const t = await getTranslations("Public.creatorsPage");
  const cards = ["one", "two", "three"];
  return (
    <PublicPage eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((key) => (
          <article key={key} className="border border-border bg-surface p-6">
            <h2 className="text-xl font-semibold">
              {t(`cards.${key === "one" ? 0 : key === "two" ? 1 : 2}.title`)}
            </h2>
            <p className="mt-3 text-sm leading-6 text-primary/70">
              {t(`cards.${key === "one" ? 0 : key === "two" ? 1 : 2}.body`)}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-10">
        <CTA href="/register">{t("cta")}</CTA>
      </div>
    </PublicPage>
  );
}
