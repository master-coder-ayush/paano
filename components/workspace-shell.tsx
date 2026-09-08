import Link from "next/link";
import type React from "react";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  Building2,
  ClipboardCheck,
  CreditCard,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Target,
  UsersRound,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  authorizeWorkspace,
  demoStats,
  navigationByType,
  type DemoUser,
  type WorkspaceType,
  withAsParam,
} from "@/lib/workspace-foundation";

const icons = {
  brand: Building2,
  creator: UserRound,
  agency: LayoutDashboard,
  admin: ShieldCheck,
};

const navIcons = {
  overview: LayoutDashboard,
  spaces: FolderKanban,
  campaigns: Target,
  creators: Search,
  collaborations: FileText,
  messages: MessageSquare,
  billing: CreditCard,
  settings: Settings,
  myCard: UserRound,
  earnings: Wallet,
  affiliate: ReceiptText,
  clients: Building2,
  budgets: Wallet,
  reports: FileText,
  roster: UsersRound,
  opportunities: Inbox,
  review: ShieldCheck,
  support: MessageSquare,
};

type AuthorizedWorkspace = NonNullable<ReturnType<typeof authorizeWorkspace>["workspace"]>;

export function WorkspaceGuard({
  user,
  allowedTypes,
  children,
}: {
  user: DemoUser | null;
  allowedTypes: WorkspaceType[];
  children: (props: { state: "allowed"; workspace: AuthorizedWorkspace; user: DemoUser }) => React.ReactNode;
}) {
  const t = useTranslations("Workspace.guard");
  const result = authorizeWorkspace(user, allowedTypes);

  if (result.state !== "allowed" || !user || !result.workspace) {
    return (
      <main className="min-h-screen bg-background px-6 py-8 text-primary">
        <div className="mx-auto max-w-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center bg-accent text-primary">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-primary/70">{t("eyebrow")}</p>
              <h1 className="mt-2 text-2xl font-semibold">{t("title")}</h1>
              <p className="mt-3 leading-7 text-primary/75">{t("body", { state: result.state })}</p>
              <Link
                href="/dashboard"
                className="mt-5 inline-flex bg-primary px-4 py-2 text-sm font-semibold text-background"
              >
                {t("action")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return <>{children({ state: "allowed", workspace: result.workspace, user })}</>;
}

export function WorkspaceShell({
  user,
  workspace,
  area,
  title,
  description,
  children,
}: {
  user: DemoUser;
  workspace: AuthorizedWorkspace;
  area: keyof typeof icons;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const common = useTranslations("Common");
  const t = useTranslations("Workspace");
  const Icon = icons[area];
  const nav = navigationByType[workspace.type];

  return (
    <main className="min-h-screen bg-background text-primary">
      <div className="grid min-h-screen lg:grid-cols-[72px_1fr]">
        <aside className="group z-20 border-b border-border bg-sidebar px-3 py-5 text-primary shadow-sm transition-[width] duration-200 lg:w-[72px] lg:border-b-0 lg:border-r lg:hover:w-[260px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex size-10 shrink-0 items-center justify-center bg-accent text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
              <div className="font-semibold">{common("brand")}</div>
              <div className="truncate text-xs text-primary/65">{workspace.name}</div>
            </div>
          </div>
          <nav className="mt-7 grid gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                href={withAsParam(item.href, user)}
                iconKey={item.labelKey as keyof typeof navIcons}
                label={t(`navigation.${item.labelKey}`)}
              />
            ))}
          </nav>
        </aside>

        <section className="px-5 py-6 sm:px-7 lg:px-9">
          <header className="flex flex-col justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-primary/70">
                {common(`workspaceTypes.${workspace.type}`)} {common("workspace")}
              </p>
              <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
              <p className="mt-2 max-w-3xl leading-7 text-primary/75">{description}</p>
            </div>
            <div className="border border-border bg-surface px-4 py-3 text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="mt-1 text-primary/70">{common(`roles.${workspace.role}`)}</div>
            </div>
          </header>
          <div className="py-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

function NavLink({
  href,
  iconKey,
  label,
}: {
  href: string;
  iconKey: keyof typeof navIcons;
  label: string;
}) {
  const Icon = navIcons[iconKey] ?? LayoutDashboard;

  return (
    <Link
      href={href}
      title={label}
      className="flex h-10 items-center gap-3 overflow-hidden px-2 text-sm text-primary/75 transition hover:bg-accent/35 hover:text-primary"
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className="whitespace-nowrap opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
        {label}
      </span>
    </Link>
  );
}

export function StatGrid({ area }: { area: keyof typeof demoStats }) {
  const t = useTranslations(`Workspace.stats.${area}`);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {demoStats[area].map(([labelKey, value]) => (
        <div key={labelKey} className="border border-border bg-surface p-4 shadow-sm">
          <p className="text-sm text-primary/70">{t(labelKey)}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: string;
}) {
  return (
    <div className="border border-dashed border-border bg-surface/80 p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center bg-accent text-primary">
          <ClipboardCheck className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-primary/75">{body}</p>
          {action ? <p className="mt-3 text-sm font-medium text-primary">{action}</p> : null}
        </div>
      </div>
    </div>
  );
}
