import { z } from "zod";
import { ChatItem } from "./chat";

export const CodeProvider = z.enum(["claude", "codex"]);
export type CodeProvider = z.infer<typeof CodeProvider>;

export const CodeExecutionMode = z.enum(["acceptEdits", "fullAccess", "readOnly"]);
export type CodeExecutionMode = z.infer<typeof CodeExecutionMode>;

export const CodeThread = z.object({
  schemaVersion: z.literal(1),
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  title: z.string().max(160),
  provider: CodeProvider,
  mode: CodeExecutionMode,
  plan: z.boolean(),
  model: z.string(),
  providerOptions: z.record(z.unknown()).default({}),
  items: z.array(ChatItem),
  status: z.enum(["idle", "running", "waiting", "error"]),
  isDraft: z.boolean().default(false),
  createdAtUnixMs: z.number().int().nonnegative(),
  updatedAtUnixMs: z.number().int().nonnegative()
}).strict();
export type CodeThread = z.infer<typeof CodeThread>;
