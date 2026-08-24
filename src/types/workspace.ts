import { z } from "zod";

export const WorkMode = z.enum(["agent", "code", "chat"]);
export type WorkMode = z.infer<typeof WorkMode>;

export const SystemDestination = z.enum(["dashboard", "routines", "plugins", "skills"]);
export type SystemDestination = z.infer<typeof SystemDestination>;

export const RouteKind = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("agent") }).strict(),
  z.object({ kind: z.literal("workspace") }).strict(),
  z.object({ kind: z.literal("chat") }).strict(),
  z.object({ kind: z.literal("destination"), destination: SystemDestination }).strict()
]);
export type RouteKind = z.infer<typeof RouteKind>;

export const AppearanceTheme = z.enum(["dark", "light"]);
export type AppearanceTheme = z.infer<typeof AppearanceTheme>;

export const ShellPreferences = z.object({
  schemaVersion: z.literal(1),
  workMode: WorkMode,
  route: RouteKind,
  selectedWorkspaceId: z.string().uuid().nullable(),
  selectedAgentId: z.string().uuid().nullable(),
  sidebarVisible: z.boolean(),
  appearance: AppearanceTheme,
  zoomPercent: z.number().int().min(60).max(200)
}).strict();
export type ShellPreferences = z.infer<typeof ShellPreferences>;

export const WorkspaceProfile = z.object({
  id: z.string().uuid(),
  displayName: z.string().trim().min(1).max(255),
  createdAtUnixMs: z.number().int().nonnegative(),
  lastOpenedAtUnixMs: z.number().int().nonnegative()
}).strict();
export type WorkspaceProfile = z.infer<typeof WorkspaceProfile>;

export const OccupantKind = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("terminal"), sessionId: z.string().uuid() }).strict(),
  z.object({ kind: z.literal("browser"), surfaceId: z.string().uuid() }).strict(),
  z.object({ kind: z.literal("thread"), threadId: z.string().uuid() }).strict()
]);
export type OccupantKind = z.infer<typeof OccupantKind>;

export const PaneLeaf = z.object({
  type: z.literal("leaf"),
  id: z.string().uuid(),
  occupant: OccupantKind
}).strict();
export type PaneLeaf = z.infer<typeof PaneLeaf>;

export type PaneNode =
  | PaneLeaf
  | {
      type: "split";
      id: string;
      axis: "horizontal" | "vertical";
      children: PaneNode[];
      ratios: number[];
    };

export const PaneNodeSchema: z.ZodType<PaneNode> = z.lazy(() =>
  z.discriminatedUnion("type", [
    PaneLeaf,
    z.object({
      type: z.literal("split"),
      id: z.string().uuid(),
      axis: z.enum(["horizontal", "vertical"]),
      children: z.array(PaneNodeSchema).min(2).max(64),
      ratios: z.array(z.number().positive().finite()).min(2).max(64)
    }).strict()
  ])
);

export const WorkspaceTab = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1).max(80),
  root: PaneNodeSchema,
  focusedLeafId: z.string().uuid().nullable()
}).strict();
export type WorkspaceTab = z.infer<typeof WorkspaceTab>;

export const WorkspaceLayout = z.object({
  schemaVersion: z.literal(1),
  workspaceId: z.string().uuid(),
  tabs: z.array(WorkspaceTab).min(1).max(32),
  activeTabId: z.string().uuid()
}).strict();
export type WorkspaceLayout = z.infer<typeof WorkspaceLayout>;
