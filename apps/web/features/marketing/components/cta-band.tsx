import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"

export function CtaBand() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-24 h-64 bg-[radial-gradient(50%_60%_at_50%_50%,var(--primary)_0%,transparent_70%)] opacity-40"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-background sm:text-4xl">
              Set your gym up on Rackrage
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-pretty text-background/70">
              Create an account, add your plans and members, and start taking
              check-ins today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                className="h-11 w-full bg-primary px-6 text-sm hover:bg-primary/90 sm:w-auto"
                nativeButton={false}
                render={
                  <Link href="/signup">
                    Get started free
                    <ArrowRight className="size-4" />
                  </Link>
                }
              />
              <Button
                variant="ghost"
                className="h-11 w-full px-6 text-sm text-background hover:bg-background/10 hover:text-background sm:w-auto"
                nativeButton={false}
                render={<Link href="/login">Sign in</Link>}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
