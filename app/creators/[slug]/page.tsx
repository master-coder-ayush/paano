import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCreator } from "@/lib/creator-marketplace";
export default async function PublicCreatorCard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("PublicCard");
  const creator = getCreator((await params).slug);
  if (!creator || creator.status !== "published") notFound();
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-5xl font-semibold">{creator.name}</h1>
      <p className="mt-4 text-xl text-primary/70">{creator.headline}</p>
      <div className="mt-10 grid gap-6 border border-border p-6">
        <p className="leading-7">{creator.bio}</p>
        <p>
          <strong>{t("topics")}</strong> {creator.topics.join(" · ")}
        </p>
        <p>
          <strong>{t("audience")}</strong>{" "}
          {creator.followerCount.toLocaleString()} {t("followers")}
        </p>
        <p>
          <strong>{t("rate")}</strong> ${creator.price.toLocaleString()}{" "}
          {t("perPost")}
        </p>
        <a className="underline" href={creator.linkedinUrl}>
          {t("linkedin")}
        </a>
      </div>
    </main>
  );
}
