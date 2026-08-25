import type { Profile } from "@/features/tenant/dashboard/components/site-header"

interface WelcomeBannerProps {
  profile?: Profile
}

export function WelcomeBanner({ profile }: WelcomeBannerProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground">
        Welcome back{profile?.name ? `, ${profile.name}` : ""}
      </h1>
      <p className="text-sm text-muted-foreground">
        Here&apos;s what&apos;s happening at your gym today, {today}.
      </p>
    </div>
  )
}
