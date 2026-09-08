import Link from "next/link";
import { ArrowRight, Check, Menu } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function PublicHeader() {
  const common = await getTranslations("Common");
  const t = await getTranslations("Public");
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="text-xl font-semibold tracking-normal">{common("brand")}</Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label={t("nav.label")}>
          <Link href="/creators">{t("nav.creators")}</Link>
          <Link href="/pricing">{t("nav.pricing")}</Link>
          <Link href="/about">{t("nav.about")}</Link>
          <Link href="/help">{t("nav.help")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden px-3 py-2 text-sm font-semibold sm:block">{common("signIn")}</Link>
          <Link href="/register" className="bg-primary px-4 py-2 text-sm font-semibold text-background">{common("signUp")}</Link>
          <Menu className="ml-2 size-5 md:hidden" aria-label={t("nav.menu")} />
        </div>
      </div>
    </header>
  );
}

export async function PublicFooter() {
  const common = await getTranslations("Common");
  const t = await getTranslations("Public");
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div><p className="text-lg font-semibold">{common("brand")}</p><p className="mt-2 max-w-xs text-sm leading-6 text-primary/65">{t("footer.blurb")}</p></div>
        <div><p className="text-sm font-semibold">{t("footer.product")}</p><div className="mt-3 grid gap-2 text-sm text-primary/70"><Link href="/creators">{t("nav.creators")}</Link><Link href="/pricing">{t("nav.pricing")}</Link><Link href="/reports">{t("footer.reports")}</Link><Link href="/resources">{t("footer.resources")}</Link><Link href="/pricing.md">{t("footer.pricingMarkdown")}</Link><Link href="/llms.txt">{t("footer.llms")}</Link></div></div>
        <div><p className="text-sm font-semibold">{t("footer.company")}</p><div className="mt-3 grid gap-2 text-sm text-primary/70"><Link href="/about">{t("nav.about")}</Link><Link href="/help">{t("nav.help")}</Link><Link href="/contact">{t("footer.contact")}</Link><Link href="/privacy">{t("footer.privacy")}</Link><Link href="/terms">{t("footer.terms")}</Link></div></div>
      </div>
    </footer>
  );
}

export async function PublicFrame({ children }: { children: React.ReactNode }) {
  return <><PublicHeader />{children}<PublicFooter /></>;
}

export async function PublicPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: React.ReactNode }) {
  return <PublicFrame><main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:px-10"><p className="text-sm font-semibold uppercase text-primary/55">{eyebrow}</p><h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-primary/70">{intro}</p>{children}</main></PublicFrame>;
}

export function CTA({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-background">{children}<ArrowRight className="size-4" aria-hidden="true" /></Link>; }
export function FeatureList({ items }: { items: string[] }) { return <ul className="mt-6 grid gap-3 text-sm text-primary/75">{items.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{item}</li>)}</ul>; }
