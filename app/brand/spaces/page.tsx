import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";
import { listSpaces } from "@/lib/brand-workspace";
export default async function SpacesPage({
  searchParams,
}: PageProps<"/brand/spaces">) {
  const q = await searchParams;
  const user = userFromDemoKey(q.as);
  const t = await getTranslations("BrandSpaces");
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("listTitle")}</h2>
            <Link
              href={`/brand/spaces/new?as=${activeUser.key}`}
              className="bg-primary px-4 py-2 text-sm font-semibold text-background"
            >
              {t("new")}
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {listSpaces(workspace.id).map((space) => (
              <Link
                key={space.id}
                href={`/brand/spaces/${space.id}?as=${activeUser.key}`}
                className="border border-border bg-surface p-5"
              >
                <h3 className="font-semibold">{space.name}</h3>
                <p className="mt-1 text-sm text-primary/70">
                  {space.industry} · {space.website}
                </p>
                <p className="mt-3 text-sm">{space.description}</p>
              </Link>
            ))}
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
