import { getTranslations } from "next-intl/server";
import { CTA, PublicPage } from "@/components/public-site";
export default async function ResourcesPage() {
  const t = await getTranslations("Public.generic");
  return (
    <PublicPage eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
      <div className="mt-8">
        <CTA href="/creators">{t("cta")}</CTA>
      </div>
    </PublicPage>
  );
}
