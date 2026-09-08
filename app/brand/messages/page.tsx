import { getTranslations } from "next-intl/server";
import {
  WorkspaceGuard,
  WorkspaceShell,
  EmptyState,
} from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";
import { listMessages } from "@/lib/collaborations";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = userFromDemoKey((await searchParams).as);
  const t = await getTranslations("Messages");
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: active }) => (
        <WorkspaceShell
          user={active}
          workspace={workspace}
          area="brand"
          title={t("title")}
          description={t("description")}
        >
          <div className="border border-border bg-surface p-5">
            <h2 className="font-semibold">{t("threadTitle")}</h2>
            {listMessages("thread_collab_launch_arjun").map((m) => (
              <p
                key={m.id}
                className="mt-4 border-l-2 border-accent pl-3 text-sm"
              >
                {m.body}
              </p>
            ))}
            <EmptyState title={t("replyTitle")} body={t("replyBody")} />
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
