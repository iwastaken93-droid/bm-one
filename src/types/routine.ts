import { z } from "zod";

export const CadenceKind = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("interval"),
    seconds: z.number().int().min(60).max(86400 * 30)
  }).strict(),
  z.object({
    kind: z.literal("clock"),
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
    weekdays: z.array(z.number().int().min(0).max(6)).nullable()
  }).strict()
]);
export type CadenceKind = z.infer<typeof CadenceKind>;

export const Routine = z.object({
  id: z.string().uuid(),
  agentId: z.string().uuid(),
  title: z.string().trim().min(1).max(128),
  prompt: z.string().trim().min(1).max(32768),
  cadence: CadenceKind,
  workspaceId: z.string().uuid().nullable(),
  enabled: z.boolean(),
  lastRunAtUnixMs: z.number().int().nonnegative().nullable(),
  nextRunAtUnixMs: z.number().int().nonnegative().nullable()
}).strict();
export type Routine = z.infer<typeof Routine>;
