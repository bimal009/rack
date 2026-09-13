"use client"

import { CalendarCheck, CreditCard, Users } from "lucide-react"

const upcomingRenewals = [
  { name: "Bikash Thapa", due: "Tomorrow" },
  { name: "Priya Gurung", due: "In 3 days" },
  { name: "Anjali Rai", due: "In 5 days" },
]

const attendanceBars = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 74 },
  { label: "Wed", value: 58 },
  { label: "Thu", value: 81 },
  { label: "Fri", value: 90 },
]

export function Features() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            Built for how gyms actually run
          </h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground">
            Three things eat up a front desk&apos;s day. Chautari Fit handles all
            three from one screen.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <div className="rounded-2xl border border-border bg-primary/5 p-6 md:col-span-2 md:row-span-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Member portal
            </h3>
            <p className="mt-2 max-w-md text-sm text-pretty text-muted-foreground">
              Members check their plan, payment history, and check-in streak
              without calling the front desk.
            </p>

            <div className="mt-6 rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Bikash Thapa</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                Annual plan, active
              </p>
              <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-muted">
                <span className="h-full w-[72%] rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                262 of 365 days used
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/40 p-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarCheck className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Attendance tracking
            </h3>
            <p className="mt-2 text-sm text-pretty text-muted-foreground">
              See who showed up, and when your gym actually gets busy.
            </p>

            <div className="mt-5 flex h-16 items-end gap-2">
              {attendanceBars.map((bar) => (
                <div key={bar.label} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="w-full rounded-t-sm bg-primary/60" style={{ height: `${bar.value}%` }} />
                  <span className="text-[10px] text-muted-foreground">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-primary/10 p-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-background text-primary">
              <CreditCard className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Billing and renewals
            </h3>
            <p className="mt-2 text-sm text-pretty text-muted-foreground">
              Know who is due before they walk out the door.
            </p>

            <div className="mt-5 space-y-2.5">
              {upcomingRenewals.map((row) => (
                <div key={row.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{row.name}</span>
                  <span className="text-muted-foreground">{row.due}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}