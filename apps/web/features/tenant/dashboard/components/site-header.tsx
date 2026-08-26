"use client"


import { SidebarTrigger } from "@repo/ui/components/ui/sidebar"

interface SiteHeaderProps {
  title: string
}



export function SiteHeader({ title }: SiteHeaderProps) {



  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b px-4 lg:px-6">
      <div className="flex w-full items-center gap-3">
        <SidebarTrigger className="-ml-1" />

        <div className="hidden flex-col leading-tight sm:flex">
          <h1 className="text-base font-semibold text-foreground">
            {title}
          </h1>

        </div>

     
      </div>
    </header>
  )
}
