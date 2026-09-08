import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AuthShell, Field, FormError, SubmitButton } from "@/components/auth/auth-shell";
import type { SearchPageProps } from "@/lib/page-props";

export default async function ForgotPasswordPage({
  searchParams,
}: SearchPageProps) {
  const common = await getTranslations("Common");
  const t = await getTranslations("Auth.forgotPassword");
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
      {params.sent ? (
        <p className="mb-4 border border-border bg-accent px-3 py-2 text-sm text-foreground">
          {t("sent")}
        </p>
      ) : null}
      <form action="/api/auth/forgot-password" className="grid gap-4" method="post">
        <Field label={common("email")} name="email" type="email" />
        <SubmitButton label={t("submit")} />
      </form>
    </AuthShell>
  );
}
