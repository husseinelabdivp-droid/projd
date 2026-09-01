import { z } from "zod";

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
] as const;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 * 1024;

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  fileName: z.string().min(1),
  fileSize: z
    .number()
    .positive()
    .max(MAX_UPLOAD_BYTES, "File exceeds the 5GB upload limit"),
  fileType: z.enum(ALLOWED_VIDEO_TYPES, {
    errorMap: () => ({ message: "Only MP4, MOV, and WEBM files are supported" }),
  }),
  contentType: z.enum(["gaming", "twitch", "youtube", "podcast", "other"]),
  requestedClipCount: z.union([
    z.literal(3),
    z.literal(5),
    z.literal(10),
    z.literal(20),
  ]),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
