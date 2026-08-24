import { z } from "zod";

export const TerminalDimensions = z.object({
  cols: z.number().int().positive(),
  rows: z.number().int().positive()
}).strict();
export type TerminalDimensions = z.infer<typeof TerminalDimensions>;

export const TerminalSession = z.object({
  sessionId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  workspaceName: z.string(),
  dimensions: TerminalDimensions,
  createdAtUnixMs: z.number().int().nonnegative()
}).strict();
export type TerminalSession = z.infer<typeof TerminalSession>;
