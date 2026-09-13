"use client"

import React from "react"
import Link from "next/link"
import { useGymQuery } from "../hook/useGyms"
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Globe,
  ExternalLink,
  Plus,
  LayoutDashboard,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/ui/card"
import { Skeleton } from "@repo/ui/components/ui/skeleton"
import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field"

type Gym = {
  id: string
  businessName: string
  currency: string
  address: string
  phone: string
  email: string
  website?: string | null
  createdAt: string
}



const initialOf = (name: string) =>
  name.trim().charAt(0).toUpperCase() || "G"

const GymsClientPage = () => {
  const { data, isPending, isError } = useGymQuery()

  if (isPending) return <LoadingState />
  if (isError || !data) return <ErrorState />

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Your gyms
          </h1>
          <p className="max-w-[55ch] text-sm text-muted-foreground">
            Businesses you operate on the platform.
          </p>
        </div>
        <Button size="sm" className="h-9 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          Add gym
        </Button>
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        <GymCard gym={data} />
      </div>
    </div>
  )
}

function GymCard({ gym }: { gym: Gym }) {
  const handleEdit = () => {
    // TODO: wire up edit flow (open modal / navigate to edit page)
  }

  const handleDelete = () => {
    // TODO: wire up delete mutation + confirmation
  }

  return (
    <Card className="flex w-full flex-col border-border/60 shadow-none transition-colors hover:border-border">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-4">
        <div
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
        >
          {initialOf(gym.businessName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
              {gym.businessName}
            </h3>
            <Badge
              variant="secondary"
              className="h-5 rounded-md px-1.5 text-[10px] font-normal uppercase tracking-wide"
            >
              {gym.currency}
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground"
              />
            }
          >
            <MoreVertical className="h-4 w-4" strokeWidth={1.75} />
            <span className="sr-only">Gym actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <FieldGroup className="gap-3.5">
          <Field>
            <FieldLabel className="text-xs font-medium text-muted-foreground">
              <MapPin className="h-3 w-3" strokeWidth={1.75} />
              Address
            </FieldLabel>
            <p className="line-clamp-2 text-sm text-foreground">
              {gym.address}
            </p>
          </Field>

          <Field>
            <FieldLabel className="text-xs font-medium text-muted-foreground">
              <Phone className="h-3 w-3" strokeWidth={1.75} />
              Phone
            </FieldLabel>
            <p className="truncate text-sm text-foreground">{gym.phone}</p>
          </Field>

          <Field>
            <FieldLabel className="text-xs font-medium text-muted-foreground">
              <Mail className="h-3 w-3" strokeWidth={1.75} />
              Email
            </FieldLabel>
            <p className="truncate text-sm text-foreground">{gym.email}</p>
          </Field>

          {gym.website && (
            <Field>
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                <Globe className="h-3 w-3" strokeWidth={1.75} />
                Website
              </FieldLabel>
              <Link
                href={gym.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
              >
                <span className="truncate">{gym.website}</span>
                <ExternalLink
                  className="h-3 w-3 shrink-0"
                  strokeWidth={1.75}
                />
              </Link>
            </Field>
          )}
        </FieldGroup>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/40 py-3">
<Link
  href={`/gyms/${gym.id}`}
  className="flex h-9 w-full flex-row items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
>
  <LayoutDashboard className="h-4 w-4 shrink-0" strokeWidth={1.75} />
  Visit dashboard
</Link>

 
      </CardFooter>
    </Card>
  )
}

function LoadingState() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex w-full flex-col border-border/60 shadow-none">
            <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-12" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-0">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/40 py-3">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-3 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ErrorState() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
      <Card className="border-border/60 shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Building2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              We couldn&apos;t load your gyms
            </p>
            <p className="text-xs text-muted-foreground">
              Check your connection and try refreshing the page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GymsClientPage