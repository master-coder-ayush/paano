import { getTranslations } from "next-intl/server";
import { PublicPage } from "@/components/public-site";
export default async function TermsPage() {
  const t = await getTranslations("Public.legal");
  const body = await getTranslations("Public.generic");
  return (
    <PublicPage
      eyebrow={t("termsEyebrow")}
      title={t("termsTitle")}
      intro={body("intro")}
    />
  );
}
