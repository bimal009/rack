import { OnboardingInput, onboardingSchema } from "@repo/types";
import { eq } from "drizzle-orm";
import { ValidationError } from "../../lib/errors";
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