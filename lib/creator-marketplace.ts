import { randomUUID } from "node:crypto";

export type CreatorCard = {
  id: string;
  workspaceId: string;
  slug: string;
  name: string;
  linkedinUrl: string;
  headline: string;
  bio: string;
  country: string;
  topics: string[];
  followerCount: number;
  price: number;
  currency: string;
  status: "published" | "draft" | "hidden";
  verification: "verified" | "pending";
};

const cards: CreatorCard[] = [
  {
    id: "creator_arjun",
    workspaceId: "workspace_creator_demo",
    slug: "arjun-mehta",
    name: "Arjun Mehta",
    linkedinUrl: "https://linkedin.com/in/arjunmehta",
    headline: "B2B SaaS growth and developer tools creator",
    bio: "I write practical ideas for teams building and selling technical products.",
    country: "India",
    topics: ["B2B SaaS", "Developer tools", "Founder-led sales"],
    followerCount: 18400,
    price: 750,
    currency: "USD",
    status: "published",
    verification: "verified",
  },
  {
    id: "creator_maya",
    workspaceId: "workspace_creator_maya",
    slug: "maya-chen",
    name: "Maya Chen",
    linkedinUrl: "https://linkedin.com/in/mayachen",
    headline: "RevOps operator translating complexity into clarity",
    bio: "Clear, useful content for modern revenue and marketing teams.",
    country: "United States",
    topics: ["RevOps", "Marketing", "AI"],
    followerCount: 32700,
    price: 1200,
    currency: "USD",
    status: "published",
    verification: "verified",
  },
  {
    id: "creator_jonas",
    workspaceId: "workspace_creator_jonas",
    slug: "jonas-keller",
    name: "Jonas Keller",
    linkedinUrl: "https://linkedin.com/in/jonaskeller",
    headline: "Product leader covering fintech and product strategy",
    bio: "I help ambitious product teams communicate what they are building.",
    country: "Germany",
    topics: ["Fintech", "Product", "Leadership"],
    followerCount: 9800,
    price: 500,
    currency: "USD",
    status: "published",
    verification: "verified",
  },
];

export function listCreators(
  filters: {
    query?: string;
    topic?: string;
    country?: string;
    minFollowers?: number;
    maxFollowers?: number;
    minPrice?: number;
    maxPrice?: number;
  } = {},
) {
  const query = filters.query?.toLowerCase().trim();
  return cards.filter(
    (card) =>
      card.status === "published" &&
      (!query ||
        [card.name, card.headline, card.bio, ...card.topics]
          .join(" ")
          .toLowerCase()
          .includes(query)) &&
      (!filters.topic || card.topics.includes(filters.topic)) &&
      (!filters.country || card.country === filters.country) &&
      (filters.minFollowers === undefined ||
        card.followerCount >= filters.minFollowers) &&
      (filters.maxFollowers === undefined ||
        card.followerCount <= filters.maxFollowers) &&
      (filters.minPrice === undefined || card.price >= filters.minPrice) &&
      (filters.maxPrice === undefined || card.price <= filters.maxPrice),
  );
}

export function getCreator(value: string) {
  return cards.find((card) => card.id === value || card.slug === value);
}
export function getCreatorForWorkspace(workspaceId: string) {
  return cards.find((card) => card.workspaceId === workspaceId);
}
export function updateCreator(
  workspaceId: string,
  input: Partial<CreatorCard>,
) {
  const card = getCreatorForWorkspace(workspaceId);
  if (!card) return null;
  Object.assign(card, input, {
    id: card.id,
    workspaceId: card.workspaceId,
    slug: card.slug,
  });
  return card;
}
export function creatorTopics() {
  return [...new Set(cards.flatMap((card) => card.topics))].sort();
}
export function createDraft(
  workspaceId: string,
  input: Omit<
    CreatorCard,
    "id" | "workspaceId" | "slug" | "status" | "verification"
  >,
) {
  const card = {
    ...input,
    id: randomUUID(),
    workspaceId,
    slug: input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    status: "draft" as const,
    verification: "pending" as const,
  };
  cards.push(card);
  return card;
}
