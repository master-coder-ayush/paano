import { ArrowRight, DatabaseZap, Globe2, HeartPulse, Layers3 } from "lucide-react";
import { getTranslations } from "next-intl/server";

const foundation = [
  {
    icon: Globe2,
    key: "i18n",
  },
  {
    icon: DatabaseZap,
    key: "database",
  },
  {
    icon: HeartPulse,
    key: "health",
  },
  {
    icon: Layers3,
    key: "ui",
  },
] as const;

export default async function Home() {
  const t = await getTranslations("Home");

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#15130f]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between border-b border-[#d9d1c3] pb-5">
          <div className="text-xl font-semibold tracking-normal">{t("brand")}</div>
          <a
            href="/api/health"
            className="inline-flex items-center gap-2 rounded-md bg-[#15130f] px-4 py-2 text-sm font-medium text-[#f7f4ee] transition hover:bg-[#343025]"
          >
            {t("healthLink")}
            <HeartPulse className="size-4" aria-hidden="true" />
          </a>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#716753]">
              {t("eyebrow")}
            </p>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-normal text-balance sm:text-6xl lg:text-7xl">
              {t("headline")}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5c5445]">
              {t("intro")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/api/health"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#e94f2f] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#cf4428]"
              >
                {t("primaryCta")}
                <ArrowRight className="size-5" aria-hidden="true" />
              </a>
              <div className="rounded-md border border-[#d9d1c3] px-5 py-3 text-base font-medium text-[#3b362d]">
                {t("stack")}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {foundation.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="grid grid-cols-[auto_1fr] gap-4 rounded-lg border border-[#d9d1c3] bg-white/70 p-5 shadow-sm"
              >
                <div className="flex size-11 items-center justify-center rounded-md bg-[#15130f] text-[#f7f4ee]">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{t(`cards.${key}.title`)}</h2>
                  <p className="mt-1 text-sm leading-6 text-[#5c5445]">
                    {t(`cards.${key}.body`)}
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
