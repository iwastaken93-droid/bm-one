import { z } from "zod";

const CreditInt = z.number().int().min(-1000000000000).max(1000000000000);

export const CreditsBalance = z.object({
  balance: CreditInt,
  cycleBalance: CreditInt,
  purchasedBalance: CreditInt,
  currentCycleGranted: CreditInt,
  currentCycleSpent: CreditInt,
  lifetimeGranted: CreditInt,
  lifetimeSpent: CreditInt,
  lastGrantedAt: z.string().min(1).max(64).nullable()
}).strict();
export type CreditsBalance = z.infer<typeof CreditsBalance>;

export function getCreditStatus(balance: number): "empty" | "low" | "ok" {
  if (balance < 50) return "empty";
  if (balance < 500) return "low";
  return "ok";
}
