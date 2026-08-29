import { OnboardingInput, onboardingSchema, UpdateGymInput, updateGymSchema } from "@repo/types";
import { eq } from "drizzle-orm";
import { InternalServerError, NotFoundError, ValidationError } from "../../lib/errors";
import { gymSport, gyms, staff, user } from "../../db/schema";
import { db } from "../../db";

export const onboardGym = async (gym: OnboardingInput, userId: string) => {
  const result = onboardingSchema.safeParse(gym);

  if (!result.success) {
    throw new ValidationError(
      "Invalid onboarding data",
      result.error.flatten()
    );
  }

  return db.transaction(async (tx) => {
    const [gymRecord] = await tx
      .insert(gyms)
      .values({ ...result.data, ownerUserId: userId })
      .returning();

    if (!gymRecord) {
      throw new InternalServerError("Failed to create gym");
    }

    await tx
      .update(user)
      .set({ onboarded: true, isClaimed: true })
      .where(eq(user.id, userId));

    await tx.insert(staff).values({
      gymId: gymRecord.id,
      role: "admin",
      userId,
    });

    await tx.insert(gymSport).values(
      result.data.specialties.map((name) => ({ gymId: gymRecord.id, name }))
    );

    return gymRecord;
  });
};

export const getGymByOwner = async (userId: string) => {
  const [gymRecord] = await db
    .select()
    .from(gyms)
    .where(eq(gyms.ownerUserId, userId))
    .limit(1);

  if (!gymRecord) {
    throw new NotFoundError("Gym not found");
  }

  return gymRecord;
};

export const updateGym = async (input: UpdateGymInput, userId: string) => {
  const result = updateGymSchema.safeParse(input);

  if (!result.success) {
    throw new ValidationError("Invalid gym details", result.error.flatten());
  }

  const [gymRecord] = await db
    .update(gyms)
    .set(result.data)
    .where(eq(gyms.ownerUserId, userId))
    .returning();

  if (!gymRecord) {
    throw new NotFoundError("Gym not found");
  }

  return gymRecord;
};
export const getGymBySlug = async (slug: string) => {
  const [gym] = await db
    .select()
    .from(gyms)
    .where(eq(gyms.slug, slug))
    .limit(1);

  return gym;
};

