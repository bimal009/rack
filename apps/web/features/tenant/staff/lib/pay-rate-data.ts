import { initialClassTypes } from "@/features/tenant/settings/types/lib/data"

import type { PayRatePolicy } from "./pay-rate-schema"

export const classScopeOptions = [
  "All classes",
  ...initialClassTypes.map((c) => c.name),
]

export const initialPayRatePolicies: PayRatePolicy[] = [
  {
    id: "pay_1",
    mode: "Individual Training",
    policyName: "Standard Instructor Rate",
    perSessionRate: 800,
    compensateUnpaidBookings: false,
    appliesToInstructorType: "Personal Trainer",
    entranceMethod: "All entrance methods",
  },
  {
    id: "pay_2",
    mode: "Individual Training",
    policyName: "Personal Training Revenue Share",
    revenueSharePercent: 40,
    compensateUnpaidBookings: true,
    appliesToInstructorType: "Personal Trainer",
    entranceMethod: "Any membership",
  },
  {
    id: "pay_3",
    mode: "Class",
    policyName: "Group Class Standard",
    perClassRate: 700,
    perPersonRate: 20,
    classScope: "All classes",
    compensateUnpaidBookings: false,
    appliesToInstructorType: "All Instructors",
    entranceMethod: "All entrance methods",
  },
]

export function generatePayRateId() {
  return `pay_${Math.random().toString(36).slice(2, 10)}`
}
