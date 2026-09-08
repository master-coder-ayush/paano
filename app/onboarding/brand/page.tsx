import { getTranslations } from "next-intl/server";
import { AuthShell, Field, FormError, Select, SubmitButton, Textarea } from "@/components/auth/auth-shell";
import type { SearchPageProps } from "@/lib/page-props";

export default async function BrandOnboardingPage({
  searchParams,
}: SearchPageProps) {
  const common = await getTranslations("Common");
  const t = await getTranslations("Onboarding.brand");
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      body={t("body")}
      homeLabel={common("brand")}
    >
      <FormError message={params.error} />
      <form action="/api/onboarding/brand" className="grid gap-4" method="post">
        <Field label={t("companyName")} name="companyName" />
        <Field label={t("website")} name="website" type="url" placeholder={t("websitePlaceholder")} />
        <Select
          label={t("industry")}
          name="industry"
          placeholder={t("industryPlaceholder")}
          options={[
            { label: t("industries.b2bSaas"), value: "b2b_saas" },
            { label: t("industries.fintech"), value: "fintech" },
            { label: t("industries.healthcare"), value: "healthcare" },
            { label: t("industries.ecommerce"), value: "ecommerce" },
            { label: t("industries.education"), value: "education" },
            { label: t("industries.professionalServices"), value: "professional_services" },
            { label: t("industries.developerTools"), value: "developer_tools" },
            { label: t("industries.marketingAdvertising"), value: "marketing_advertising" },
          ]}
        />
        <Textarea label={t("targetIcp")} name="targetIcp" />
        <SubmitButton label={t("submit")} />
      </form>
    </AuthShell>
  );
}
