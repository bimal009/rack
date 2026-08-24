import {
  Dumbbell,
  HeartPulse,
  Flower2,
  Swords,
  UserRound,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

import type { BusinessType } from "@/features/auth/types"

export const BUSINESS_TYPES: Array<BusinessType & { icon: LucideIcon }> = [
  {
    id: "gym",
    title: "Gym",
    description: "Open gym access, personal training, and group fitness classes.",
    icon: Dumbbell,
  },
  {
    id: "fitness-studio",
    title: "Fitness Studio",
    description: "A full-service studio offering group classes and personal training.",
    icon: HeartPulse,
  },
  {
    id: "yoga-pilates",
    title: "Yoga & Pilates",
    description: "Instructor-led mat, reformer, and mindfulness sessions.",
    icon: Flower2,
  },
  {
    id: "martial-arts",
    title: "Martial Arts",
    description: "Boxing, BJJ, karate, or other combat sports training.",
    icon: Swords,
  },
  {
    id: "personal-training",
    title: "Personal Training",
    description: "One-on-one and small group coaching sessions.",
    icon: UserRound,
  },
  {
    id: "something-else",
    title: "Something else",
    description: "Set up your business your way.",
    icon: Sparkles,
  },
]

export const SPECIALTY_OPTIONS = [
  "Strength Training",
  "CrossFit",
  "HIIT",
  "Indoor Cycling",
  "Boxing",
  "Yoga",
  "Pilates",
  "Stretching",
  "Personal Training",
  "Group Classes",
]
