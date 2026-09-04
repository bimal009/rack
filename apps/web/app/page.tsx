import { CtaBand } from "@/features/marketing/components/cta-band"
import { Faq } from "@/features/marketing/components/faq"
import { Features } from "@/features/marketing/components/features"
import { Hero } from "@/features/marketing/components/hero"
import { HowItWorks } from "@/features/marketing/components/how-it-works"
import { Pricing } from "@/features/marketing/components/pricing"
import { SiteFooter } from "@/features/marketing/components/site-footer"
import { SiteHeader } from "@/features/marketing/components/site-header"

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  )
}
