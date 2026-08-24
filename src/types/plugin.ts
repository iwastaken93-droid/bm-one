import { z } from "zod";

export const PluginAuthType = z.enum(["apiKey", "oauthMCP", "localMCP", "preview"]);
export type PluginAuthType = z.infer<typeof PluginAuthType>;

export const PluginDescriptor = z.object({
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(80),
  vendor: z.string().min(1).max(80),
  summary: z.string().max(1024),
  authentication: PluginAuthType,
  prefersDarkTile: z.boolean(),
  logo: z.union([
    z.object({ onDark: z.string(), onLight: z.string() }),
    z.object({ file: z.string() })
  ]),
  fallbackIcon: z.string().nullable()
}).strict();
export type PluginDescriptor = z.infer<typeof PluginDescriptor>;
