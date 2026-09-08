import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AuthShell, Field, FormError, SubmitButton } from "@/components/auth/auth-shell";
import type { SearchPageProps } from "@/lib/page-props";

export default async function ResetPasswordPage({ searchParams }: SearchPageProps) {
  const common = await getTranslations("Common");
  const t = await getTranslations("Auth.resetPassword");
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      body={t("body")}
      homeLabel={common("brand")}
      footer={
        <Link className="text-sm font-semibold text-primary" href="/login">
          {common("backToLogin")}
        </Link>
      }
    >
      <FormError message={params.error} />
      <form action="/api/auth/reset-password" className="grid gap-4" method="post">
        <Field label={t("token")} name="token" />
        <Field label={common("password")} name="password" type="password" />
        <SubmitButton label={t("submit")} />
      </form>
    </AuthShell>
  );
}
