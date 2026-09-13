import Link from "next/link"

const links = [
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#pricing" },
  { label: "Support", href: "/support" },
]

export function Footer() {
  return (
    <footer>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
            C
          </span>
          <span className="text-sm font-medium text-foreground">
            Chautari Fit
          </span>
        </div>

        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-muted-foreground">
          Chautari Fit, Butwal, Nepal
        </p>
      </div>
    </footer>
  )
}