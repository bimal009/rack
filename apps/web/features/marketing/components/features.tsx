import {
  BarChart3,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  MapPin,
  MessageSquare,
  Package,
  ScanLine,
  UserCog,
  Users,
} from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"

const features = [
  {
    icon: Users,
    title: "Members",
    description:
      "One profile per member with contact details, plan history and current status.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance",
    description:
      "Check members in at the desk, or let them scan themselves on the way in.",
  },
  {
    icon: CreditCard,
    title: "Plans and billing",
    description:
      "Membership plans with your own billing cycle, signup fee and session limits.",
  },
  {
    icon: Dumbbell,
    title: "Classes",
    description:
      "Schedule classes, cap the roster, and keep instructors and rooms from clashing.",
  },
  {
    icon: MapPin,
    title: "Areas and bookings",
    description:
      "Courts, studios and floors with their own hourly pricing and booking limits.",
  },
  {
    icon: UserCog,
    title: "Staff and roles",
    description:
      "Add trainers and front desk staff with pay rates and controlled access.",
  },
  {
    icon: Package,
    title: "Retail and inventory",
    description:
      "Sell supplements, apparel and packages at the counter with stock kept in sync.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    description:
      "Revenue, attendance and renewals reported without exporting to a spreadsheet.",
  },
  {
    icon: MessageSquare,
    title: "Notifications",
    description:
      "Email, SMS and WhatsApp messages about renewals, classes and offers.",
  },
  {
    icon: ScanLine,
    title: "Door access",
    description:
      "Entry tied to an active membership, so the door matches who has paid.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="h-7 px-3 text-xs">
            Features
          </Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            What Rackrage covers
          </h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground">
            Members, payments, classes and staff all run in the same system, so
            your records stay consistent across the gym.
          </p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title}>
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-sm text-pretty text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
