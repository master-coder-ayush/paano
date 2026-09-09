import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import {
  getCollaboration,
  listActivity,
  listDrafts,
} from "@/lib/collaborations";
import { CollaborationActions } from "@/components/collaboration-actions";
import { userFromDemoKey } from "@/lib/workspace-foundation";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const c = getCollaboration((await params).id);
  if (!c) notFound();
  const user = userFromDemoKey((await searchParams).as);
  const t = await getTranslations("Collaborations");
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: active }) => (
        <WorkspaceShell
          user={active}
          workspace={workspace}
          area="brand"
          title={t("detailTitle")}
          description={t("detailDescription")}
        >
          <div className="border border-border bg-surface p-6">
            <p className="text-sm uppercase">{t(`status.${c.status}`)}</p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="font-semibold">{t("price")}</dt>
                <dd>
                  {c.currency} {c.price.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">{t("due")}</dt>
                <dd>{c.dueAt}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold">{t("notes")}</dt>
                <dd>{c.notes}</dd>
              </div>
            </dl>
            {listDrafts(c.id)[0] && (
              <div className="mt-5 border-t border-border pt-5">
                <h2 className="font-semibold">{t("submitDraft")}</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {listDrafts(c.id)[0].body}
                </p>
              </div>
            )}
            <CollaborationActions
              id={c.id}
              token={active.tokenLabel}
              role="brand"
              status={c.status}
              labels={{
                submitDraft: t("submitDraft"),
                draftPlaceholder: t("draftPlaceholder"),
                approve: t("approve"),
                requestChanges: t("requestChanges"),
                publishedUrl: t("publishedUrl"),
                submitPublished: t("submitPublished"),
                saved: t("saved"),
                error: t("error"),
              }}
            />
            <h2 className="mt-6 font-semibold">{t("timeline")}</h2>
            <div className="mt-3 grid gap-2 text-sm">
              {listActivity(c.id).map((a) => (
                <p key={a.id} className="border-l-2 border-accent pl-3">
                  {a.action}
                  {a.note ? ` — ${a.note}` : ""}
                </p>
              ))}
            </div>
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
