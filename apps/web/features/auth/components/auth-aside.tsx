import { Dumbbell } from "lucide-react"

interface AuthAsideProps {
  eyebrow?: string
  title: string
  description: string
  tags?: string[]
}

export function AuthAside({
  eyebrow = "Rackrage",
  title,
  description,
  tags = [],
}: AuthAsideProps) {
  return (
    <div className="relative hidden h-full overflow-hidden bg-neutral-950 lg:block">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          color: "white",
        }}
      />
      <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary/40 blur-[120px]" />
      <div className="absolute bottom-0 left-0 size-96 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative flex h-full flex-col justify-between p-10">
        <div className="flex items-center gap-2 text-white/70">
          <Dumbbell className="size-4" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase">
            {eyebrow}
          </span>
        </div>

        <div className="max-w-md space-y-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h2
            className="text-4xl leading-tight text-white"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {title}
          </h2>
          <p className="text-balance text-sm leading-relaxed text-white/60">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
