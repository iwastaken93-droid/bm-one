import { z } from "zod";

export const AgentEngine = z.enum([
  "claude-code",
  "codex",
  "cursor",
  "gemini",
  "open-code",
  "github-copilot",
  "droid",
  "grok",
  "aider",
  "amp",
  "antigravity",
  "deep-seek",
  "terminal"
]);
export type AgentEngine = z.infer<typeof AgentEngine>;

export const AgentFace = z.enum(["chats", "memory", "skills", "settings"]);
export type AgentFace = z.infer<typeof AgentFace>;

export const AgentProfile = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(80),
  engine: AgentEngine,
  purpose: z.string().max(4000),
  createdAtUnixMs: z.number().int().nonnegative()
}).strict();
export type AgentProfile = z.infer<typeof AgentProfile>;

export const AgentSkill = z.object({
  id: z.string().min(1).max(128),
  name: z.string().min(1).max(128),
  description: z.string().max(2048),
  source: z.string().max(65536).optional(),
  installed: z.boolean()
}).strict();
export type AgentSkill = z.infer<typeof AgentSkill>;

export const AgentMind = z.object({
  schemaVersion: z.literal(1),
  agentId: z.string().uuid(),
  memory: z.string().max(65536),
  user: z.string().max(65536),
  skills: z.array(AgentSkill).max(512),
  memoryUpdatedAtUnixMs: z.number().int().nonnegative().nullable(),
  userUpdatedAtUnixMs: z.number().int().nonnegative().nullable(),
  memoryRevision: z.string().nullable(),
  userRevision: z.string().nullable(),
  readIssues: z.array(z.string()).max(512)
}).strict();
export type AgentMind = z.infer<typeof AgentMind>;

export const AgentAvailability = z.object({
  scope: z.string(),
  phase: z.enum(["ready", "loading", "error"]),
  hasProbed: z.boolean(),
  teammates: z.array(
    z.object({
      engine: AgentEngine,
      installed: z.boolean(),
      verified: z.boolean(),
      version: z.string().nullable()
    })
  )
}).strict();
export type AgentAvailability = z.infer<typeof AgentAvailability>;
