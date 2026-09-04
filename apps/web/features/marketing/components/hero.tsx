import Link from "next/link"
import { ArrowRight, CalendarCheck, TrendingUp, Users } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"

const previewStats = [
  { label: "Active members", value: "1,284", icon: Users },
  { label: "Check-ins today", value: "312", icon: CalendarCheck },
  { label: "Revenue this month", value: "NPR 8.4L", icon: TrendingUp },
]

const previewRows = [
  { name: "Aarav Sharma", plan: "Gold Membership", status: "Active" },
  { name: "Sita Gurung", plan: "Annual Elite", status: "Active" },
  { name: "Bikash Thapa", plan: "Student Quarterly", status: "Expiring" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_50%,var(--primary)_0%,transparent_70%)] opacity-[0.09]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="h-7 gap-1.5 px-3 text-xs">
            <span className="size-1.5 rounded-full bg-primary" />
            Gym management software
          </Badge>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl md:text-6xl">
            Run your gym from{" "}
            <span className="text-primary">one dashboard</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            Rackrage handles members, attendance, plans, billing, classes and
            staff for gyms, studios and clubs.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              className="h-11 w-full px-6 text-sm sm:w-auto"
              nativeButton={false}
              render={
                <Link href="/signup">
                  Get started free
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
            <Button
              variant="outline"
              className="h-11 w-full px-6 text-sm sm:w-auto"
              nativeButton={false}
              render={<a href="#pricing">See pricing</a>}
            />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Free plan available. Set up your gym in minutes.
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl sm:mt-16">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                Dashboard
              </span>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {previewStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <stat.icon className="size-3.5" />
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {stat.label}
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <div className="hidden grid-cols-[2fr_2fr_1fr] gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground sm:grid">
                  <span>Member</span>
                  <span>Plan</span>
                  <span>Status</span>
                </div>
                {previewRows.map((row) => (
                  <div
                    key={row.name}
                    className="grid grid-cols-[2fr_2fr_1fr] items-center gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0"
                  >
                    <span className="truncate font-medium text-foreground">
                      {row.name}
                    </span>
                    <span className="truncate text-muted-foreground">
                      {row.plan}
                    </span>
                    <span>
                      <Badge
                        variant={row.status === "Active" ? "default" : "outline"}
                        className="font-normal"
                      >
                        {row.status}
                      </Badge>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
