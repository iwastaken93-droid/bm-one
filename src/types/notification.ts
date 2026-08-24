import { z } from "zod";

export const NotificationRecord = z.object({
  id: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  priority: z.enum(["low", "normal", "high", "critical"]).default("normal"),
  isRead: z.boolean().default(false),
  createdAtUnixMs: z.number().int().nonnegative(),
  actionTarget: z.record(z.unknown()).optional()
}).strict();
export type NotificationRecord = z.infer<typeof NotificationRecord>;

export const NotificationSnapshot = z.object({
  schemaVersion: z.literal(1),
  revision: z.number(),
  records: z.array(NotificationRecord),
  unreadCount: z.number().int().nonnegative(),
  openInputRequestCount: z.number().int().nonnegative().default(0),
  authorization: z.enum(["authorized", "denied", "prompt"]).default("prompt"),
  preferences: z.object({
    osNotificationsEnabled: z.boolean().default(true),
    finishSoundEnabled: z.boolean().default(true),
    inputRequestsEnabled: z.boolean().default(true)
  })
}).strict();
export type NotificationSnapshot = z.infer<typeof NotificationSnapshot>;
