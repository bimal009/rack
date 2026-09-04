"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Mail, MessageCircle, MessageSquare, ScanLine } from "lucide-react"
import type { Plan } from "@repo/types"

import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import { Skeleton } from "@repo/ui/components/ui/skeleton"
import { cn } from "@repo/ui/lib/utils"

import { usePublicPlansQuery } from "../hooks/use-plans"

type BillingPeriod = "monthly" | "yearly"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
  maximumFractionDigits: 0,
})

/** Plan flags, in the order they should read on a pricing card. */
const featureFlags = [
  { key: "attendanceEnabled", label: "Attendance & check-ins" },
  { key: "staffEnabled", label: "Staff accounts & roles" },
  { key: "reportsEnabled", label: "Reports & insights" },
  { key: "inventoryEnabled", label: "Inventory & retail" },
  { key: "smsEnabled", label: "SMS notifications" },
  { key: "emailEnabled", label: "Email notifications" },
  { key: "websiteEnabled", label: "Public booking page" },
  { key: "reEngagementEnabled", label: "Member re-engagement" },
  { key: "doorLockEnabled", label: "Smart door access" },
] as const satisfies readonly { key: keyof Plan; label: string }[]

function planFeatures(plan: Plan): string[] {
  const items: string[] = [
    plan.maxMembers ? `Up to ${plan.maxMembers.toLocaleString()} members` : "Unlimited members",
  ]

  for (const flag of featureFlags) {
    if (plan[flag.key]) items.push(flag.label)
  }

  return items
}

function priceFor(plan: Plan, period: BillingPeriod): number {
  if (period === "monthly") return plan.monthlyPrice
  return plan.yearlyPrice ?? plan.monthlyPrice * 12
}

export function Pricing() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly")
  const { data: plans, isLoading, isError } = usePublicPlansQuery()

  return (
    <section id="pricing" className="border-b border-border bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="h-7 px-3 text-xs">
            Pricing
          </Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            Plans and pricing
          </h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground">
            Start on the free plan and move up when your member list grows.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex items-center gap-1 rounded-xl border border-border bg-background p-1"
          >
            {(["monthly", "yearly"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={period === value}
                onClick={() => setPeriod(value)}
                className={cn(
                  "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  period === value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-background p-6"
                >
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="mt-4 h-9 w-32" />
                  <Skeleton className="mt-6 h-10 w-full" />
                  <div className="mt-6 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError || !plans || plans.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-background p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Pricing is being updated. Create an account to see the plans
                available for your gym.
              </p>
              <Button
                className="mt-5 h-10 px-5"
                nativeButton={false}
                render={<Link href="/signup">Get started</Link>}
              />
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-6",
                plans.length === 1 && "mx-auto max-w-sm",
                plans.length === 2 && "mx-auto max-w-3xl sm:grid-cols-2",
                plans.length >= 3 && "md:grid-cols-3"
              )}
            >
              {plans.map((plan, index) => {
                const recommended =
                  plans.length >= 3 ? index === 1 : index === 0
                const price = priceFor(plan, period)
                const showSaving = period === "yearly" && plan.discountPercent > 0

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "flex flex-col rounded-2xl border bg-background p-6 transition-colors",
                      recommended
                        ? "border-primary ring-1 ring-primary/25"
                        : "border-border hover:border-foreground/20"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-foreground">
                        {plan.name}
                      </h3>
                      {recommended && <Badge>Recommended</Badge>}
                    </div>

                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className="text-3xl font-semibold tracking-tight text-foreground">
                        {currency.format(price)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /{period === "monthly" ? "month" : "year"}
                      </span>
                    </div>

                    <div className="mt-2 flex min-h-5 flex-wrap items-center gap-2">
                      {showSaving && (
                        <span className="text-xs font-medium text-primary">
                          Save {plan.discountPercent}% paying yearly
                        </span>
                      )}
                      {plan.trialDays > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {plan.trialDays}-day free trial
                        </span>
                      )}
                    </div>

                    <Button
                      variant={recommended ? "default" : "outline"}
                      className="mt-6 h-10 w-full"
                      nativeButton={false}
                      render={
                        <Link href="/signup">
                          {plan.monthlyPrice === 0
                            ? "Get started free"
                            : "Choose " + plan.name}
                        </Link>
                      }
                    />

                    <ul className="mt-6 space-y-3 border-t border-border pt-6">
                      {planFeatures(plan).map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm text-muted-foreground"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-14">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              Add-ons
            </h3>
            <p className="mt-3 text-sm text-pretty text-muted-foreground">
              Two things are billed separately from your plan, so you only pay
              for what your gym actually uses.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquare className="size-5" />
              </span>
              <h4 className="mt-4 text-base font-semibold text-foreground">
                Notification credits
              </h4>
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                Email, SMS and WhatsApp messages run on credits. Top up when you
                need to, and each message sent draws from your balance. Nothing
                expires into a monthly fee you did not use.
              </p>
              <ul className="mt-5 space-y-3 border-t border-border pt-5">
                {[
                  { icon: Mail, label: "Email" },
                  { icon: MessageSquare, label: "SMS" },
                  { icon: MessageCircle, label: "WhatsApp" },
                ].map((channel) => (
                  <li
                    key={channel.label}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <channel.icon className="size-4 shrink-0 text-primary" />
                    <span>{channel.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ScanLine className="size-5" />
              </span>
              <h4 className="mt-4 text-base font-semibold text-foreground">
                Door access
              </h4>
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                Tie the front door to an active membership, so entry matches who
                has paid. Hardware is fitted once at your gym.
              </p>
              <div className="mt-5 flex items-baseline gap-2 border-t border-border pt-5">
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                  {currency.format(13999)}
                </span>
                <span className="text-sm text-muted-foreground">
                  one-time installation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
