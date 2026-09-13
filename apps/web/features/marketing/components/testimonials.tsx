import Image from "next/image"

export function Testimonial() {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="relative size-14 overflow-hidden rounded-full border border-border">
          <Image
            src="https://picsum.photos/seed/chautari-fit-owner/112/112"
            alt="Placeholder photo of a gym owner"
            fill
            className="object-cover"
          />
        </div>

        <blockquote className="mt-6 max-w-2xl text-xl font-medium text-balance text-foreground sm:text-2xl">
          Chautari Fit replaced three different spreadsheets. Our front desk
          checks a member in, takes a payment, and sees who is behind on
          renewal, all from one screen.
        </blockquote>

        <p className="mt-5 text-sm text-muted-foreground">
          Sudip Karki - Owner, Himal Strength Club
        </p>

        <p className="mt-8 text-sm text-muted-foreground">
          18 hours a week no longer spent on manual check-ins
        </p>
      </div>
    </section>
  )
}