import { z } from "zod";

export const ChatItemKind = z.enum(["user", "assistant", "system", "tool", "error"]);
export type ChatItemKind = z.infer<typeof ChatItemKind>;

export const ChatItem = z.object({
  id: z.string().min(1).max(128),
  kind: ChatItemKind,
  text: z.string(),
  title: z.string().nullable(),
  detail: z.string().nullable(),
  status: z.enum(["idle", "running", "waiting", "completed", "error"]).nullable(),
  streaming: z.boolean(),
  exitCode: z.number().nullable(),
  createdAtUnixMs: z.number().int().nonnegative(),
  attachments: z.array(z.string()).default([])
}).strict();
export type ChatItem = z.infer<typeof ChatItem>;

export const ChatThread = z.object({
  schemaVersion: z.literal(1),
  revision: z.string(),
  id: z.string().uuid(),
  profileId: z.string().uuid().nullable(),
  provider: z.string(),
  title: z.string().max(160),
  items: z.array(ChatItem).max(10000),
  mode: z.enum(["acceptEdits", "fullAccess", "readOnly"]),
  plan: z.boolean(),
  model: z.string(),
  status: z.enum(["idle", "running", "waiting", "error"]),
  createdAtUnixMs: z.number().int().nonnegative(),
  updatedAtUnixMs: z.number().int().nonnegative()
}).strict();
export type ChatThread = z.infer<typeof ChatThread>;

export const ChatTurnUpdate = z.discriminatedUnion("kind", [
  z.object({ sequence: z.number(), kind: z.literal("upsert"), item: ChatItem }).strict(),
  z.object({ sequence: z.number(), kind: z.literal("delta"), itemId: z.string(), text: z.string() }).strict(),
  z.object({ sequence: z.number(), kind: z.literal("status"), status: z.enum(["idle", "running", "waiting", "error"]) }).strict(),
  z.object({ sequence: z.number(), kind: z.literal("usage"), usage: z.object({ inputTokens: z.number(), outputTokens: z.number(), costUsd: z.number().optional() }) }).strict(),
  z.object({ sequence: z.number(), kind: z.literal("finished"), ok: z.boolean(), stoppedByBuilder: z.boolean().optional() }).strict()
]);
export type ChatTurnUpdate = z.infer<typeof ChatTurnUpdate>;
