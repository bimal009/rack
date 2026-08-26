import type { Metadata } from "next"

import { PayrollPage } from "@/features/tenant/staff/components/payroll-page"

export const metadata: Metadata = {
  title: "Payroll",
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  return <PayrollPage tenant={tenant} />
}
