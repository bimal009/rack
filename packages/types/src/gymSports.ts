import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";

export const gymSportSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GymSport = z.infer<typeof gymSportSchema>;

export const gymSportInsertSchema = z.object({
  name: z.string().trim().min(1, "Enter a sport name").max(100),
});

export type NewGymSport = z.infer<typeof gymSportInsertSchema>;

export const gymSportUpdateSchema = gymSportInsertSchema.partial();

export type UpdateGymSport = z.infer<typeof gymSportUpdateSchema>;

export const gymSportListQuerySchema = z.object({ ...paginationFields });

export type GymSportListQuery = z.infer<typeof gymSportListQuerySchema>;

export type GymSportListResponse = PaginatedResponse<GymSport>;
