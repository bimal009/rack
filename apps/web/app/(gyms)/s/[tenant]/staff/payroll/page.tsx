import type { Metadata } from "next"

import { PayrollList } from "@/features/tenant/staff/components/payroll-list"

export const metadata: Metadata = {
  title: "Payroll",
}

export default function Page() {
  return <PayrollList />
}
