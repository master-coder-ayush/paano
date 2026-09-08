import { getTranslations } from "next-intl/server";
import { PublicPage } from "@/components/public-site";
export default async function AboutPage() {
  const t = await getTranslations("Public.about");
  return (
    <PublicPage eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
  );
}
