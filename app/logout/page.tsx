import { getTranslations } from "next-intl/server";
import { AuthShell, SubmitButton } from "@/components/auth/auth-shell";

export default async function LogoutPage() {
  const common = await getTranslations("Common");
  const t = await getTranslations("Auth.logout");

  return (
    <AuthShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      body={t("body")}
      homeLabel={common("brand")}
    >
      <form action="/api/auth/logout" method="post">
        <SubmitButton label={t("submit")} />
      </form>
    </AuthShell>
  );
}
