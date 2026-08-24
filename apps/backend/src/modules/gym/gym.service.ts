import { OnboardingInput, onboardingSchema } from "@repo/types";
import { ValidationError } from "../../lib/errors";
import { gyms } from "../../db/schema";
import { db } from "../../db";

export const onboardGym = async (gym: OnboardingInput, userId: string) => {
  const result = onboardingSchema.safeParse(gym);

  if (!result.success) {
    throw new ValidationError(
      "Invalid onboarding data",
      result.error.flatten()
    );
  }

  const [gymRecord] = await db
    .insert(gyms)
    .values({ ...result.data, ownerUserId: userId })
    .returning();

  return gymRecord;
};