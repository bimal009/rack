import { FinalCta } from "@/features/marketing/components/cta-band";
import { Features } from "@/features/marketing/components/features";
import { Footer } from "@/features/marketing/components/footer";
import { Hero } from "@/features/marketing/components/hero";
import { Pricing } from "@/features/marketing/components/pricing";
import { Testimonial } from "@/features/marketing/components/testimonials";


export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <Testimonial />
      <Pricing />
      <FinalCta />
      <Footer />
    </main>
  )
}