import {
  OnboardingInput,
  onboardingSchema,
  UpdateGymInput,
  updateGymSchema,
} from "@repo/types";
import { eq } from "drizzle-orm";
import { InternalServerError, NotFoundError, ValidationError } from "../../lib/errors";
import {
  areaType,
  classType,
  gymFeature,
  gymOperatingHour,
  gymSport,
  gyms,
  instructorType,
  membershipCategory,
  productCategory,
  productFeature,
  staff,
  taxRate,
  user,
} from "../../db/schema";
import { db } from "../../db";
import {
  DEFAULT_AREA_TYPES,
  DEFAULT_CLASS_TYPES,
  DEFAULT_INSTRUCTOR_TYPES,
  DEFAULT_MEMBERSHIP_CATEGORIES,
  DEFAULT_PRODUCT_CATEGORIES,
  DEFAULT_PRODUCT_FEATURES,
  DEFAULT_TAX_RATES,
} from "./gym.constants";

export const onboardGym = async (gym: OnboardingInput, userId: string) => {
  const result = onboardingSchema.safeParse(gym);

  if (!result.success) {
    throw new ValidationError(
      "Invalid onboarding data",
      result.error.flatten()
    );
  }

  const { specialties, features, openingHours, ...gymData } = result.data;

  return db.transaction(async (tx) => {
    const [gymRecord] = await tx
      .insert(gyms)
      .values({ ...gymData, ownerUserId: userId })
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
      isOwner: true,
    });

    await tx.insert(gymSport).values(
      specialties.map((name) => ({ gymId: gymRecord.id, name }))
    );

    await tx.insert(gymFeature).values(
      features.map((name) => ({ gymId: gymRecord.id, name }))
    );

    await tx.insert(areaType).values(
      DEFAULT_AREA_TYPES.map((area) => ({ ...area, gymId: gymRecord.id }))
    );

    await tx.insert(instructorType).values(
      DEFAULT_INSTRUCTOR_TYPES.map((name) => ({ gymId: gymRecord.id, name }))
    );

    await tx.insert(classType).values(
      DEFAULT_CLASS_TYPES.map((name) => ({ gymId: gymRecord.id, name }))
    );

    await tx.insert(taxRate).values(
      DEFAULT_TAX_RATES.map((tax) => ({ ...tax, gymId: gymRecord.id }))
    );

    await tx.insert(productCategory).values(
      DEFAULT_PRODUCT_CATEGORIES.map((name) => ({ gymId: gymRecord.id, name }))
    );

    await tx.insert(membershipCategory).values(
      DEFAULT_MEMBERSHIP_CATEGORIES.map((name) => ({ gymId: gymRecord.id, name }))
    );

    await tx.insert(productFeature).values(
      DEFAULT_PRODUCT_FEATURES.map((name) => ({ gymId: gymRecord.id, name }))
    );

    if (openingHours.length > 0) {
      await tx.insert(gymOperatingHour).values(
        openingHours.map((range) => ({
          gymId: gymRecord.id,
          day: range.day,
          open: range.open.slice(0, 5),
          close: range.close.slice(0, 5),
        }))
      );
    }

    return { ...gymRecord, openingHours };
  });
};

export const getGymByOwner = async (userId: string) => {
  const gymRecord = await db.query.gyms.findFirst({
    where: { ownerUserId: userId },
  });

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
export const getGymById = async (id: string) => {
  return db.query.gyms.findFirst({
    where: { id },
  });
};



