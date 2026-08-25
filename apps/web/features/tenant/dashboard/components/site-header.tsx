"use client"

import { useRouter } from "next/navigation"
import { Bell, LogOut, Mail, Plus, Settings } from "lucide-react"

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar"
import { Button } from "@repo/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { SidebarTrigger } from "@repo/ui/components/ui/sidebar"
import { authClient } from "@/auth-client"

export interface Profile {
  name?: string | null
  email?: string | null
}

interface SiteHeaderProps {
  title: string
  profile?: Profile
}

function initials(name?: string | null) {
  if (!name) return "GM"
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "GM"
}

export function SiteHeader({ title, profile }: SiteHeaderProps) {
  const router = useRouter()

  async function handleLogOut() {
    await authClient.signOut()
    router.push("/login")
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b px-4 lg:px-6">
      <div className="flex w-full items-center gap-3">
        <SidebarTrigger className="-ml-1" />

        <div className="hidden flex-col leading-tight sm:flex">
          <h1 className="text-base font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground">
            Welcome back{profile?.name ? `, ${profile.name}` : ""}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            size="icon-sm"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" />
            <span className="sr-only">Add new</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full text-muted-foreground"
          >
            <Mail className="size-4" />
            <span className="sr-only">Messages</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative rounded-full text-muted-foreground"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              <Avatar size="sm">
                <AvatarFallback className="bg-primary/10 font-medium text-primary">
                  {initials(profile?.name)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <p className="truncate text-sm font-medium text-foreground">
                  {profile?.name ?? "Gym Owner"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile?.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogOut}>
                <LogOut />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
