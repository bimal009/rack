"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { PosView } from "./pos-view"

interface PosPageProps {
  tenant: string
}

export function PosPage({ tenant }: PosPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="New Sale" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
        <Link
          href={`/s/${tenant}/revenue/orders`}
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Orders
        </Link>
        <PosView tenant={tenant} />
      </div>
    </>
  )
}
