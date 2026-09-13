import { Request } from "express";
import { BadRequestError, ForbiddenError, ValidationError } from "./errors";
import { addDays, addMonths, format, parseISO } from "date-fns";
import type { GymPlan } from "@repo/types";

export function gymId(req: Request): string {
  if (!req.gym) {
    throw new ForbiddenError("Gym context is missing");
  }
  return req.gym.id;
}

export function pathId(req: Request, name = "id"): string {
  const value = req.params[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new BadRequestError(`${name} is required`);
  }
  return value;
}



export const calculateEndDate = (
  startDate: string,
  plan: Pick<
    GymPlan,
    "billingType" | "billingIntervalUnit" | "billingIntervalCount"
  >
): string => {
  const date = parseISO(startDate);

  if (plan.billingType === "one_time") return startDate;

  if (plan.billingType === "custom") {
    if (!plan.billingIntervalUnit || !plan.billingIntervalCount) {
      throw new ValidationError("Plan has an invalid billing interval");
    }

    if (plan.billingIntervalUnit === "month") {
      return format(
        addDays(addMonths(date, plan.billingIntervalCount), -1),
        "yyyy-MM-dd"
      );
    }

    const days =
      plan.billingIntervalUnit === "week"
        ? plan.billingIntervalCount * 7
        : plan.billingIntervalCount;
    return format(addDays(date, days - 1), "yyyy-MM-dd");
  }

  if (plan.billingType === "weekly") {
    return format(addDays(date, 6), "yyyy-MM-dd");
  }

  const months =
    plan.billingType === "monthly"
      ? 1
      : plan.billingType === "quarterly"
        ? 3
        : 12;
  return format(addDays(addMonths(date, months), -1), "yyyy-MM-dd");
};




