import {
  Dumbbell,
  HeartPulse,
  Flower2,
  Swords,
  UserRound,
  Ellipsis,
  type LucideIcon,
} from "lucide-react"

import type { OnboardingInput } from "@repo/types"

interface BusinessType {
  id: OnboardingInput["businessType"]
  title: string
  description: string
  icon: LucideIcon
}

export const BUSINESS_TYPES: BusinessType[] = [
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
    icon: Ellipsis,
  },
]
