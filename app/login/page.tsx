import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AuthShell, Field, FormError, SubmitButton } from "@/components/auth/auth-shell";
import type { SearchPageProps } from "@/lib/page-props";

export default async function LoginPage({ searchParams }: SearchPageProps) {
  const common = await getTranslations("Common");
  const t = await getTranslations("Auth.login");
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      body={t("body")}
      homeLabel={common("brand")}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span>
            {t("registerPrompt")}{" "}
            <Link className="font-semibold text-primary" href="/register">
              {t("registerLink")}
            </Link>
          </span>
          <Link className="font-semibold text-primary" href="/forgot-password">
            {t("forgotPassword")}
          </Link>
        </div>
      }
    >
      <FormError message={params.error} />
      <form action="/api/auth/login" className="grid gap-4" method="post">
        <Field label={common("email")} name="email" type="email" />
        <Field label={common("password")} name="password" type="password" />
        <SubmitButton label={t("submit")} />
      </form>
    </AuthShell>
  );
}
