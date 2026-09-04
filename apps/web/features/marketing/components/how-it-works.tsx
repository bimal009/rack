import { Badge } from "@repo/ui/components/ui/badge"

const steps = [
  {
    title: "Set up your gym",
    description:
      "Add your details, opening hours, and the sports and facilities you offer.",
  },
  {
    title: "Add plans and people",
    description:
      "Create your membership plans, invite your staff, and add members as they join.",
  },
  {
    title: "Run the day",
    description:
      "Check members in, take payments at the counter, and track renewals and revenue.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="h-7 px-3 text-xs">
            How it works
          </Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            Getting started
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
