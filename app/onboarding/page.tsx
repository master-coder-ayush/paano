import { getTranslations } from "next-intl/server";
import { AuthShell, FormError, SubmitButton } from "@/components/auth/auth-shell";
import type { SearchPageProps } from "@/lib/page-props";

export default async function OnboardingPage({ searchParams }: SearchPageProps) {
  const common = await getTranslations("Common");
  const t = await getTranslations("Onboarding.role");
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      body={t("body")}
      homeLabel={common("brand")}
    >
      <FormError message={params.error} />
      <form action="/api/onboarding/role" className="grid gap-4" method="post">
        <label className="grid gap-2 border border-border p-4">
          <span className="text-base font-semibold">{t("brandTitle")}</span>
          <span className="text-sm leading-6 text-foreground/70">{t("brandBody")}</span>
          <input className="mt-1 size-4" name="role" required type="radio" value="brand" />
        </label>
        <label className="grid gap-2 border border-border p-4">
          <span className="text-base font-semibold">{t("creatorTitle")}</span>
          <span className="text-sm leading-6 text-foreground/70">{t("creatorBody")}</span>
          <input className="mt-1 size-4" name="role" required type="radio" value="creator" />
        </label>
        <SubmitButton label={t("submit")} />
      </form>
    </AuthShell>
  );
}
