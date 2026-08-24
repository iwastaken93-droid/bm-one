import { z } from "zod";

export const SubscriptionTier = z.enum(["free", "basic", "pro", "ultra"]);
export type SubscriptionTier = z.infer<typeof SubscriptionTier>;

export const SignInStep = z.enum(["starting", "waitingForBrowser", "exchanging"]);
export type SignInStep = z.infer<typeof SignInStep>;

export const AuthPhase = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("restoring") }).strict(),
  z.object({ kind: z.literal("signedOut") }).strict(),
  z.object({ kind: z.literal("signingIn"), step: SignInStep }).strict(),
  z.object({ kind: z.literal("signedIn") }).strict()
]);
export type AuthPhase = z.infer<typeof AuthPhase>;

export const UpgradeReason = z.enum(["free", "basic", "inactive"]);
export type UpgradeReason = z.infer<typeof UpgradeReason>;

export const AuthAccess = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("unknown") }).strict(),
  z.object({ kind: z.literal("entitled") }).strict(),
  z.object({ kind: z.literal("unverified") }).strict(),
  z.object({ kind: z.literal("upgradeRequired"), reason: UpgradeReason }).strict()
]);
export type AuthAccess = z.infer<typeof AuthAccess>;

export const UserAccount = z.object({
  email: z.string().email().max(320).optional(),
  name: z.string().trim().min(1).max(128).optional()
}).strict().refine(user => user.email !== undefined || user.name !== undefined, {
  message: "Visible account copy is empty."
});
export type UserAccount = z.infer<typeof UserAccount>;

export const AuthProblem = z.discriminatedUnion("code", [
  z.object({ code: z.literal("sign_in_unavailable"), message: z.literal("BridgeMind could not start sign-in. Try again.") }).strict(),
  z.object({ code: z.literal("browser_unavailable"), message: z.literal("BridgeMind could not open the sign-in page.") }).strict(),
  z.object({ code: z.literal("sign_in_timed_out"), message: z.literal("Sign-in timed out. Try again when you are ready.") }).strict(),
  z.object({ code: z.literal("session_unavailable"), message: z.literal("BridgeMind could not restore this session.") }).strict(),
  z.object({ code: z.literal("service_unavailable"), message: z.literal("BridgeMind is unavailable. Check your connection and retry.") }).strict(),
  z.object({ code: z.literal("unexpected_response"), message: z.literal("BridgeMind returned an unexpected response. Try again.") }).strict()
]);
export type AuthProblem = z.infer<typeof AuthProblem>;

export const AuthSnapshot = z.object({
  schemaVersion: z.literal(1),
  revision: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  phase: AuthPhase,
  access: AuthAccess,
  user: UserAccount.optional(),
  subscriptionTier: SubscriptionTier,
  canReopenBrowser: z.boolean(),
  paymentRecovery: z.boolean(),
  problem: AuthProblem.optional()
}).strict().superRefine((snapshot, ctx) => {
  const isSignedIn = snapshot.phase.kind === "signedIn";
  const isWaitingBrowser = snapshot.phase.kind === "signingIn" && snapshot.phase.step === "waitingForBrowser";

  if (snapshot.canReopenBrowser !== isWaitingBrowser) {
    ctx.addIssue({
      code: "custom",
      path: ["canReopenBrowser"],
      message: "Browser recovery disagrees with the sign-in phase."
    });
  }

  if (!isSignedIn) {
    if (snapshot.access.kind !== "unknown" || snapshot.user !== undefined || snapshot.subscriptionTier !== "free" || snapshot.paymentRecovery) {
      ctx.addIssue({
        code: "custom",
        path: ["phase"],
        message: "Signed-out state retained account authority."
      });
    }
    return;
  }

  if (snapshot.user === undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["user"],
      message: "A signed-in snapshot must identify the visible account."
    });
  }
});
export type AuthSnapshot = z.infer<typeof AuthSnapshot>;
