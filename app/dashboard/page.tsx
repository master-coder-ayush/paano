import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, UsersRound, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { demoUsers, withAsParam } from "@/lib/workspace-foundation";

const iconByKey = {
  brand: Building2,
  creator: UserRound,
  agency: UsersRound,
  admin: ShieldCheck,
};

const routeByKey = {
  brand: "/brand",
  creator: "/creator",
  agency: "/agency",
  admin: "/admin",
};

export default async function Dashboard() {
  const common = await getTranslations("Common");
  const t = await getTranslations("Dashboard");

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-primary">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 border-b border-border pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary/70">{t("eyebrow")}</p>
            <h1 className="mt-2 text-4xl font-semibold">{t("headline")}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-primary/75">{t("intro")}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2 text-sm font-semibold"
          >
            {common("publicSite")}
          </Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {demoUsers.map((user) => {
            const Icon = iconByKey[user.key];
            const workspace = user.workspaces[0];
            const href = withAsParam(routeByKey[user.key], user);

            return (
              <Link
                key={user.id}
                href={href}
                className="group border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center bg-accent text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{workspace.name}</h2>
                <p className="mt-2 text-sm leading-6 text-primary/75">
                  {t("cardBody", {
                    userName: user.name,
                    role: common(`roles.${workspace.role}`),
                    workspaceType: common(`workspaceTypes.${workspace.type}`),
                  })}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {common("openArea")}
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
