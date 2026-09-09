import { randomUUID } from "node:crypto";

export type Space = {
  id: string;
  workspaceId: string;
  name: string;
  website: string;
  description: string;
  industry: string;
  icp: string;
  locations: string;
  ctaUrl: string;
  status: string;
};
export type Campaign = {
  id: string;
  workspaceId: string;
  spaceId: string;
  name: string;
  goal: string;
  budget: string;
  currency: string;
  icp: string;
  regions: string;
  ctaUrl: string;
  status: "draft" | "active" | "completed";
  startsAt: string;
  endsAt: string;
};
export type CampaignBrief = {
  id: string;
  campaignId: string;
  workspaceId: string;
  version: number;
  objectives: string;
  keyMessages: string;
  guidelines: string;
  deliverables: string;
  usageRights: string;
  approvalRules: string;
  ctaUrl: string;
  status: "draft" | "ready_for_review" | "approved" | "archived";
  createdAt: string;
  updatedAt: string;
};

const workspaceId = "workspace_brand_demo";
const spaces: Space[] = [
  {
    id: "space_acme_demo",
    workspaceId,
    name: "Acme Developer Tools",
    website: "https://acme.dev",
    description: "Developer tooling for modern product teams.",
    industry: "Developer tools",
    icp: "Engineering and product leaders at B2B SaaS companies",
    locations: "United States, United Kingdom",
    ctaUrl: "https://acme.dev/demo",
    status: "active",
  },
];
const campaigns: Campaign[] = [
  {
    id: "campaign_launch_demo",
    workspaceId,
    spaceId: "space_acme_demo",
    name: "Developer tools launch",
    goal: "Drive qualified demo requests from engineering leaders.",
    budget: "12000.00",
    currency: "USD",
    icp: "VP Engineering and technical founders",
    regions: "United States",
    ctaUrl: "https://acme.dev/demo",
    status: "active",
    startsAt: "2026-09-01",
    endsAt: "2026-10-31",
  },
];
const briefs: CampaignBrief[] = [];

export function listSpaces(workspace: string) {
  return spaces.filter((item) => item.workspaceId === workspace);
}
export function listCampaigns(workspace: string, status?: string) {
  return campaigns.filter(
    (item) =>
      item.workspaceId === workspace && (!status || item.status === status),
  );
}
export function getSpace(workspace: string, id: string) {
  return spaces.find(
    (item) => item.workspaceId === workspace && item.id === id,
  );
}
export function getCampaign(workspace: string, id: string) {
  return campaigns.find(
    (item) => item.workspaceId === workspace && item.id === id,
  );
}
export function getBrief(workspace: string, campaignId: string) {
  return briefs
    .filter((b) => b.workspaceId === workspace && b.campaignId === campaignId)
    .sort((a, b) => b.version - a.version)[0];
}
export function saveBrief(
  workspace: string,
  campaignId: string,
  input: Omit<
    CampaignBrief,
    "id" | "workspaceId" | "campaignId" | "version" | "createdAt" | "updatedAt"
  >,
) {
  const current = getBrief(workspace, campaignId);
  if (current?.status === "approved")
    throw new Error("approved_brief_immutable");
  const now = new Date().toISOString();
  if (current) {
    Object.assign(current, input, { updatedAt: now });
    return current;
  }
  const brief = {
    ...input,
    id: randomUUID(),
    workspaceId: workspace,
    campaignId,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };
  briefs.push(brief);
  return brief;
}
export function saveSpace(
  input: Omit<Space, "id" | "workspaceId">,
  workspace: string,
  id?: string,
) {
  const existing = id ? getSpace(workspace, id) : undefined;
  if (existing) Object.assign(existing, input);
  else spaces.push({ ...input, id: randomUUID(), workspaceId: workspace });
  return existing ?? spaces.at(-1)!;
}
export function saveCampaign(
  input: Omit<Campaign, "id" | "workspaceId">,
  workspace: string,
  id?: string,
) {
  const existing = id ? getCampaign(workspace, id) : undefined;
  if (existing) Object.assign(existing, input);
  else campaigns.push({ ...input, id: randomUUID(), workspaceId: workspace });
  return existing ?? campaigns.at(-1)!;
}
export function overview(workspace: string) {
  const items = listCampaigns(workspace);
  return {
    campaigns: items.length,
    spaces: listSpaces(workspace).length,
    creators: 3,
    posts: 1,
    todo: items.some((item) => item.status === "draft") ? 1 : 0,
  };
}
