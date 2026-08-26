import { OrganizationDetailsForm } from "./organization-details-form"
import { OrganizationTabs } from "./organization-tabs"

export function OrganizationPage() {
  return (
    <>
      <h1 className="text-xl font-semibold text-foreground">Organization</h1>
      <OrganizationTabs />
      <OrganizationDetailsForm />
    </>
  )
}
