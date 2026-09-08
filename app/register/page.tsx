import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AuthShell, Field, FormError, SubmitButton } from "@/components/auth/auth-shell";
import type { SearchPageProps } from "@/lib/page-props";

export default async function RegisterPage({ searchParams }: SearchPageProps) {
  const common = await getTranslations("Common");
  const t = await getTranslations("Auth.register");
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      body={t("body")}
      homeLabel={common("brand")}
      footer={
        <p className="text-sm">
          {t("loginPrompt")}{" "}
          <Link className="font-semibold text-primary" href="/login">
            {t("loginLink")}
          </Link>
        </p>
      }
    >
      <FormError message={params.error} />
      <form action="/api/auth/register" className="grid gap-4" method="post">
        <Field label={common("name")} name="name" />
        <Field label={common("email")} name="email" type="email" />
        <Field label={common("password")} name="password" type="password" />
        <SubmitButton label={t("submit")} />
      </form>
    </AuthShell>
  );
}
