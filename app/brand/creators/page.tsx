import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { listCreators, creatorTopics } from "@/lib/creator-marketplace";
import { userFromDemoKey, withAsParam } from "@/lib/workspace-foundation";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import type { SearchPageProps } from "@/lib/page-props";

export default async function BrandCreatorsPage({
  searchParams,
}: SearchPageProps) {
  const t = await getTranslations("Marketplace");
  const params = await searchParams;
  const user = userFromDemoKey(params.as);
  const topic = typeof params.topic === "string" ? params.topic : undefined;
  const country =
    typeof params.country === "string" ? params.country : undefined;
  const query = typeof params.q === "string" ? params.q : undefined;
  const creators = listCreators({ topic, country, query });
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="brand"
          title={t("title")}
          description={t("description")}
        >
          <form
            className="grid gap-3 border border-border bg-surface p-4 md:grid-cols-4"
            method="get"
          >
            <input type="hidden" name="as" value={activeUser.key} />
            <input
              name="q"
              placeholder={t("searchPlaceholder")}
              defaultValue={query}
              className="border border-border bg-background p-3"
            />
            <select
              name="topic"
              defaultValue={topic ?? ""}
              className="border border-border bg-background p-3"
            >
              <option value="">{t("allTopics")}</option>
              {creatorTopics().map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <input
              name="country"
              placeholder={t("countryPlaceholder")}
              defaultValue={country}
              className="border border-border bg-background p-3"
            />
            <button className="bg-primary px-4 py-3 text-white">
              {t("filter")}
            </button>
          </form>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {creators.map((creator) => (
              <article
                key={creator.id}
                className="border border-border bg-surface p-5"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold">{creator.name}</h2>
                  <span className="text-xs text-accent">{t("verified")}</span>
                </div>
                <p className="mt-2 text-sm text-primary/70">
                  {creator.headline}
                </p>
                <p className="mt-4 text-sm">
                  {creator.country} · {creator.followerCount.toLocaleString()}{" "}
                  {t("followers")}
                </p>
                <p className="mt-2 text-sm">{creator.topics.join(" · ")}</p>
                <p className="mt-4 font-semibold">
                  ${creator.price.toLocaleString()} {t("perPost")}
                </p>
                <Link
                  className="mt-5 inline-block text-sm underline"
                  href={withAsParam(
                    `/brand/creators/${creator.id}`,
                    activeUser,
                  )}
                >
                  {t("viewProfile")}
                </Link>
              </article>
            ))}
          </div>
          {creators.length === 0 && (
            <p className="mt-8 border border-dashed border-border p-8 text-center text-primary/65">
              {t("empty")}
            </p>
          )}
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
