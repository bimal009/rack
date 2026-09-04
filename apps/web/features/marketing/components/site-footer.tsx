import Link from "next/link"
import Image from "next/image"

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Image
              src="/logo.svg"
              alt="Rackrage"
              width={137}
              height={32}
              className="h-7 w-auto"
            />
          </Link>
          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            Members, attendance, plans and payments for gyms, studios and clubs.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="cursor-pointer rounded text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            className="cursor-pointer rounded text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Sign in
          </Link>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Rackrage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
