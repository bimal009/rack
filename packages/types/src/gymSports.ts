import { z } from "zod";

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
