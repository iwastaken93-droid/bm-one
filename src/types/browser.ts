import { z } from "zod";

export const BrowserSurface = z.object({
  surfaceId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  url: z.string().url(),
  title: z.string().default("New Tab"),
  canGoBack: z.boolean().default(false),
  canGoForward: z.boolean().default(false),
  isLoading: z.boolean().default(false),
  zoomFactor: z.number().min(0.25).max(5.0).default(1.0)
}).strict();
export type BrowserSurface = z.infer<typeof BrowserSurface>;
