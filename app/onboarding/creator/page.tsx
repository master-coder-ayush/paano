import { getTranslations } from "next-intl/server";
import { AuthShell, Field, FormError, SubmitButton, Textarea } from "@/components/auth/auth-shell";
import type { SearchPageProps } from "@/lib/page-props";

export default async function CreatorOnboardingPage({
  searchParams,
}: SearchPageProps) {
  const common = await getTranslations("Common");
  const t = await getTranslations("Onboarding.creator");
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      body={t("body")}
      homeLabel={common("brand")}
    >
      <FormError message={params.error} />
      <form action="/api/onboarding/creator" className="grid gap-4" method="post">
        <Field label={common("name")} name="name" />
        <Field label={t("linkedinUrl")} name="linkedinUrl" type="url" />
        <Field label={t("headline")} name="headline" />
        <Textarea label={t("bio")} name="bio" />
        <Field label={t("topics")} name="topics" placeholder={t("topicsPlaceholder")} />
        <Field label={t("country")} name="country" />
        <Field label={t("followerCount")} name="followerCount" min={0} type="number" />
        <Field label={t("pricePerPostAmount")} name="pricePerPostAmount" min={1} type="number" />
        <SubmitButton label={t("submit")} />
      </form>
    </AuthShell>
  );
}
