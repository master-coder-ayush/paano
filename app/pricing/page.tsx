import { getTranslations } from "next-intl/server";
import { CTA, PublicPage } from "@/components/public-site";
export default async function PricingPage() {
  const t = await getTranslations("Public.pricingPage");
  return (
    <PublicPage eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <article className="border border-border bg-surface p-7">
          <h2 className="text-2xl font-semibold">{t("selfTitle")}</h2>
          <p className="mt-3 text-sm text-primary/70">{t("selfBody")}</p>
          <p className="mt-8 font-semibold">{t("selfPrice")}</p>
        </article>
        <article className="border border-primary bg-primary p-7 text-background">
          <h2 className="text-2xl font-semibold">{t("managedTitle")}</h2>
          <p className="mt-3 text-sm text-background/70">{t("managedBody")}</p>
          <p className="mt-8 font-semibold">{t("managedPrice")}</p>
        </article>
      </div>
      <div className="mt-10">
        <CTA href="/register">{t("cta")}</CTA>
      </div>
    </PublicPage>
  );
}
