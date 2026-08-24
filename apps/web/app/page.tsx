import Link from "next/link"
import { Dumbbell } from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Dumbbell className="size-6" />
      </span>
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Rackrage
        </h1>
        <p className="max-w-md text-balance text-sm text-muted-foreground">
          Run every class, member, and payment from one place.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button size="lg" nativeButton={false} render={<Link href="/signup">Get started</Link>} />
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={<Link href="/login">Sign in</Link>}
        />
      </div>
    </main>
  )
}
