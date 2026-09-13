import Link from "next/link"

import { Button } from "@repo/ui/components/ui/button"

export function FinalCta() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <h2 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
          Run your gym from one place, starting today
        </h2>
        <p className="mt-4 max-w-md text-pretty text-muted-foreground">
          Set up memberships and attendance in an afternoon. No card required
          to start.
        </p>
        <Button
          className="mt-8 h-11 px-6"
          nativeButton={false}
          render={<Link href="/signup">Get started free</Link>}
        />
      </div>
    </section>
  )
}