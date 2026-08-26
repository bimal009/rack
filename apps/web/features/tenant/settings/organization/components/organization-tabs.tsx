const tabs = [
  "Details",
  "Subscription",
  "Users",
  "Permissions",
  "Notifications",
  "Domains",
  "APIs & webhooks",
]

export function OrganizationTabs() {
  return (
    <div className="no-scrollbar scroll-fade-x flex items-center gap-4 overflow-x-auto border-b border-border">
      {tabs.map((tab) => {
        const active = tab === "Details"
        return (
          <span
            key={tab}
            className={
              active
                ? "relative shrink-0 py-2.5 text-sm font-medium whitespace-nowrap text-foreground"
                : "shrink-0 cursor-not-allowed py-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground/50"
            }
          >
            {tab}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </span>
        )
      })}
    </div>
  )
}
