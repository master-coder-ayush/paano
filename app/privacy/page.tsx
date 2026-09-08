import { getTranslations } from "next-intl/server";
import { PublicPage } from "@/components/public-site";
export default async function PrivacyPage() {
  const t = await getTranslations("Public.legal");
  const body = await getTranslations("Public.generic");
  return (
    <PublicPage
      eyebrow={t("privacyEyebrow")}
      title={t("privacyTitle")}
      intro={body("intro")}
    />
  );
}
