import { OnboardingInput, onboardingSchema, UpdateGymInput, updateGymSchema } from "@repo/types";
import { eq } from "drizzle-orm";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { gyms, user } from "../../db/schema";
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

    await tx
      .update(user)
      .set({ role: "owner", onboarded: true })
      .where(eq(user.id, userId));

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