import { listCampaigns } from "@/lib/brand-workspace";
import { listCollaborations } from "@/lib/collaborations";
import { getCreatorForWorkspace } from "@/lib/creator-marketplace";
import { earnings, walletEntries } from "@/lib/sprint7";

export function getBrandDashboard(workspaceId: string) {
  const collaborations = listCollaborations(workspaceId, "brand");
  const campaigns = listCampaigns(workspaceId);
  const balance = walletEntries.reduce((total, entry) => {
    const amount = Number(entry.amount.replace(/[^0-9.-]/g, ""));
    return total + (entry.amount.startsWith("-") ? -amount : amount);
  }, 0);
  return {
    balance,
    pendingCreatorActions: collaborations.filter((item) =>
      ["draft", "published"].includes(item.status),
    ),
    pendingApprovals: collaborations.filter((item) => item.status === "draft"),
    published: collaborations.filter(
      (item) => item.status === "published" && item.publishedPostUrl,
    ),
    nextSteps: [
      ...(balance < 1000 ? ["topUp"] : []),
      ...(campaigns.length === 0 ? ["findCreators"] : []),
      ...(collaborations.length === 0 ? ["bookCall"] : []),
    ],
  };
}

export function getCreatorDashboard(workspaceId: string) {
  const collaborations = listCollaborations(workspaceId, "creator");
  const profile = getCreatorForWorkspace(workspaceId);
  return {
    profileCompletion: profile ? 78 : 0,
    activeCollaborations: collaborations.filter((item) =>
      ["accepted", "draft", "revision_requested", "approved"].includes(
        item.status,
      ),
    ),
    pendingRequests: collaborations.filter((item) => item.status === "invited"),
    upcoming: collaborations.filter(
      (item) => !["completed", "cancelled", "declined"].includes(item.status),
    ),
    earnings: earnings.filter((item) => item.status !== "paid"),
    hasProfile: Boolean(profile),
  };
}
