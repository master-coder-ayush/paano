import { getTranslations } from "next-intl/server";
import { PublicPage } from "@/components/public-site";
export default async function ReportsPage() {
  const t = await getTranslations("Public.generic");
  return (
    <PublicPage eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
  );
}
