

import { SiteHeader } from "@/features/tenant/components/site-header"
import data from "./data.json"
import { SectionCards } from "@/features/tenant/components/section-cards"
import { ChartAreaInteractive } from "@/features/tenant/components/chart-area-interactive"
import { DataTable } from "@/features/tenant/components/data-table"

export default function Page() {
  return (
    <>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
    </>
  )
}
