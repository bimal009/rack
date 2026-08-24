import Link from "next/link"
import { Dumbbell } from "lucide-react"

export function AuthHeader() {
  return (
    <Link
      href="/"
      className="inline-flex w-fit items-center gap-2 text-foreground"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Dumbbell className="size-4" />
      </span>
      <span
        className="text-lg"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        Rackrage
      </span>
    </Link>
  )
}
