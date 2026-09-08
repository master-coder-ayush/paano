export type EmailTemplate = "welcome" | "password_reset" | "email_verification";

export type EmailDeliveryAttemptDraft = {
  recipientUserId?: string;
  recipientEmail: string;
  template: EmailTemplate;
  metadata: Record<string, unknown>;
};

export function createEmailDeliveryAttemptDraft(draft: EmailDeliveryAttemptDraft) {
  return {
    id: "email_delivery_pending_persistence",
    recipientUserId: draft.recipientUserId ?? null,
    recipientEmail: draft.recipientEmail,
    template: draft.template,
    status: "delivery_pending",
    providerMessageId: null,
    errorMessage: null,
    metadata: draft.metadata,
  };
}

export async function enqueueEmailDeliveryAttempt(draft: EmailDeliveryAttemptDraft) {
  // TODO: Wire this to Amazon SES once SES is set up. Email delivery is intentionally
  // not active for this project right now, and auth/onboarding UI must not expose it.
  return createEmailDeliveryAttemptDraft(draft);
}
