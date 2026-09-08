import Link from "next/link";
import { ArrowRight, Building2, CircleDollarSign, Search, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";

const sections = [
  {
    icon: Building2,
    key: "companies",
  },
  {
    icon: UserRound,
    key: "creators",
  },
  {
    icon: Search,
    key: "marketplace",
  },
  {
    icon: CircleDollarSign,
    key: "operations",
  },
] as const;

export default async function Home() {
  const common = await getTranslations("Common");
  const t = await getTranslations("Home");

  return (
    <main className="min-h-screen bg-background text-primary">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between border-b border-border pb-5">
          <div className="text-xl font-semibold">{common("brand")}</div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-2 text-sm font-semibold">
              {common("signIn")}
            </Link>
            <Link
              href="/register"
              className="bg-primary px-4 py-2 text-sm font-semibold text-background"
            >
              {common("signUp")}
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary/70">{t("eyebrow")}</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.04] text-balance sm:text-6xl">
              {t("headline")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-primary/75">{t("intro")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 text-base font-semibold text-background transition hover:bg-accent hover:text-primary"
              >
                {common("openWorkspace")}
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
              <Link
                href="/api/health"
                className="inline-flex items-center justify-center border border-border bg-surface px-5 py-3 text-base font-semibold"
              >
                {common("serviceHealth")}
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {sections.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="grid grid-cols-[auto_1fr] gap-4 border border-border bg-surface p-5 shadow-sm"
              >
                <div className="flex size-11 items-center justify-center bg-accent text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{t(`sections.${key}.title`)}</h2>
                  <p className="mt-1 text-sm leading-6 text-primary/75">
                    {t(`sections.${key}.body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
