import { getTranslations } from "next-intl/server";
import { userFromDemoKey } from "@/lib/workspace-foundation";
import { getCreatorForWorkspace } from "@/lib/creator-marketplace";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import type { SearchPageProps } from "@/lib/page-props";
import { CreatorProfileForm } from "@/components/creator-profile-form";
export default async function CreatorProfileSettings({
  searchParams,
}: SearchPageProps) {
  const t = await getTranslations("CreatorCard");
  const user = userFromDemoKey((await searchParams).as);
  return (
    <WorkspaceGuard user={user} allowedTypes={["creator"]}>
      {({ workspace, user: activeUser }) => {
        const card = getCreatorForWorkspace(workspace.id);
        return (
          <WorkspaceShell
            user={activeUser}
            workspace={workspace}
            area="creator"
            title={t("editTitle")}
            description={t("editDescription")}
          >
            <CreatorProfileForm
              card={card}
              token={activeUser.tokenLabel}
              labels={{
                linkedinUrl: t("linkedinUrl"),
                headline: t("headline"),
                country: t("country"),
                followerCount: t("followerCount"),
                price: t("price"),
                bio: t("bio"),
                topics: t("topics"),
                save: t("save"),
                saving: t("saving"),
                saved: t("saved"),
                error: t("error"),
              }}
            />
          </WorkspaceShell>
        );
      }}
    </WorkspaceGuard>
  );
}
