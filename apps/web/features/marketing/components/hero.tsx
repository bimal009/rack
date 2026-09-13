"use client"

import Image from "next/image"
import Link from "next/link"

import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-16 text-center sm:px-6 sm:pt-24">
        <Badge variant="outline" className="h-7 px-3 text-xs">
          For gyms and fitness studios
        </Badge>

        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Everything your gym needs, in one calm dashboard.
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          Track memberships, attendance, and payments in real time, so your
          front desk and your members stay in sync.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            className="h-11 px-6"
            nativeButton={false}
            render={<Link href="/signup">Get started free</Link>}
          />
          <Button
            variant="ghost"
            className="h-11 px-6"
            nativeButton={false}
            render={<Link href="#pricing">See pricing</Link>}
          />
        </div>

        <div className="relative mt-14 w-full max-w-5xl pb-16 sm:pb-24">
          <div className="overflow-hidden rounded-2xl border border-border shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]">
            <Image
              src="/dashboard.png"
              alt="Chautari Fit dashboard showing active members, today's attendance, and this month's revenue"
              width={1200}
              height={750}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}