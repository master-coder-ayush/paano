import { getTranslations } from "next-intl/server";
import { CTA, FeatureList, PublicFrame } from "@/components/public-site";

export default async function Home() {
  const t = await getTranslations("Public.home");

  return (
    <PublicFrame>
      <main className="mx-auto grid min-h-[72vh] max-w-6xl items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase text-primary/55">
            {t("eyebrow")}
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
            {t("headline")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-primary/70">
            {t("intro")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTA href="/register">{t("primaryCta")}</CTA>
            <CTA href="/creators">{t("secondaryCta")}</CTA>
          </div>
        </div>
        <div className="border border-border bg-surface p-6">
          <p className="text-sm font-semibold">{t("proofTitle")}</p>
          <FeatureList
            items={[t("proofOne"), t("proofTwo"), t("proofThree")]}
          />
        </div>
      </main>
    </PublicFrame>
  );
}
