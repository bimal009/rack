"use client"

import { authClient } from "@/auth-client"
import { SiteHeader } from "@/features/tenant/dashboard/components/site-header"

import { initialCategories } from "../lib/data"
import { SimpleTypeList } from "./simple-type-list"
import { TypesNav } from "./types-nav"

interface CategoriesPageProps {
  tenant: string
}

export function CategoriesPage({ tenant }: CategoriesPageProps) {
  const { data: session } = authClient.useSession()

  return (
    <>
      <SiteHeader title="Categories" profile={session?.user} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <TypesNav tenant={tenant} />
        <SimpleTypeList
          label="Category"
          idPrefix="cat"
          hasSlug
          hasRate={false}
          initialItems={initialCategories}
        />
      </div>
    </>
  )
}
