import { z } from "zod";

export const basePaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type BasePagination = z.infer<typeof basePaginationSchema>;