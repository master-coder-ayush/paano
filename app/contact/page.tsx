import { getTranslations } from "next-intl/server";
import { PublicPage } from "@/components/public-site";
export default async function ContactPage() {
  const t = await getTranslations("Public.legal");
  return (
    <PublicPage
      eyebrow={t("contactEyebrow")}
      title={t("contactTitle")}
      intro={t("contactIntro")}
    />
  );
}
