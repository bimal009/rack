import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { AreasList } from "./areas-list"

export function AreasPage() {
  return (
    <>
      <SiteHeader title="Areas" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <AreasList />
      </div>
    </>
  )
}
